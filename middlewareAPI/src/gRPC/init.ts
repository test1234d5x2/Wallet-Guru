import * as grpc from '@grpc/grpc-js'
import { connect, Gateway, Identity, Signer, signers, Network, Contract } from '@hyperledger/fabric-gateway'
import { promises as fs, readFileSync } from 'fs'
import * as crypto from 'crypto'
import { LRUCache } from 'lru-cache'
import { Wallets, X509Identity, Wallet } from 'fabric-network'
import envOrDefault from '../utils/envOrDefault'
import generatePeerConfigsList from '../utils/generatePeerConfigsList'


interface GatewayEntry {
    gateway: Gateway
    client: grpc.Client
}

export class GatewayManager {
    private peerConfigs = generatePeerConfigsList();
    private clients: grpc.Client[] = []
    private wallet: Wallet
    private channelName: string
    private chaincodeName: string
    private gatewayCache: LRUCache<string, GatewayEntry>
    private clientTimeout: number

    private constructor(wallet: Wallet) {
        this.channelName = envOrDefault('CHANNEL_NAME', '')
        this.chaincodeName = envOrDefault('CHAINCODE_NAME', '')
        this.wallet = wallet
        this.clientTimeout = 5000

        this.gatewayCache = new LRUCache<string, GatewayEntry>({
            ttl: 1000 * 60 * 15,
            ttlAutopurge: true,
            dispose: entry => entry.gateway.close(),
        })
    }

    public static async build(): Promise<GatewayManager> {
        const walletPath = envOrDefault('WALLET_PATH', '')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        const gm = new GatewayManager(wallet)
        await gm.initialiseClients()
        return gm
    }

    private async initialiseClients(): Promise<void> {
        const newClients: grpc.Client[] = []
        const checks = this.peerConfigs.map(pc => new Promise<void>(resolve => {
            const tlsRootCert = readFileSync(pc.tlsCertPath)
            const endpoint = pc.url.replace('grpcs://', '')
            const client = new grpc.Client(endpoint,
                grpc.credentials.createSsl(tlsRootCert),
                { 'grpc.ssl_target_name_override': pc.hostAlias })

            client.waitForReady(Date.now() + this.clientTimeout, err => {
                if (!err) {
                    console.log(`Connected to peer ${pc.url}`)
                    newClients.push(client)
                } else {
                    console.warn(`Failed to connect to peer ${pc.url}: ${err.message}`)
                }
                resolve()
            })
        }))

        await Promise.all(checks)
        this.clients = newClients
        if (this.clients.length === 0) {
            console.warn('No available peers after reconnection attempt');
        }
    }

    private async pickClient(): Promise<grpc.Client | undefined> {
        const now = Date.now()
        const readyClients: grpc.Client[] = []
        for (const client of this.clients) {
            try {
                await new Promise<void>((res, rej) => {
                    client.waitForReady(now + this.clientTimeout, err => err ? rej(err) : res())
                })
                readyClients.push(client)
            } catch {

            }
        }

        if (readyClients.length > 0) {
            return readyClients[0]
        }

        console.log('No ready peers, reinitialising client pool...')
        await this.initialiseClients()
        if (this.clients.length === 0) {
            return undefined
        }
        return this.clients[0]
    }

    public async getGateway(label: string): Promise<Gateway> {
        const now = Date.now()
        const cacheEntry = this.gatewayCache.get(label)
        if (cacheEntry) {
            try {
                await new Promise<void>((res, rej) => {
                    cacheEntry.client.waitForReady(now + this.clientTimeout, err => err ? rej(err) : res())
                })
                return cacheEntry.gateway
            } catch {
                cacheEntry.gateway.close()
                this.gatewayCache.delete(label)
            }
        }

        const x509 = (await this.wallet.get(label)) as X509Identity
        if (!x509) throw new Error(`Identity ${label} not found in wallet`)

        const identity: Identity = { mspId: x509.mspId, credentials: Buffer.from(x509.credentials.certificate) }
        const privateKey = crypto.createPrivateKey(x509.credentials.privateKey)
        const signer: Signer = signers.newPrivateKeySigner(privateKey)

        const client = await this.pickClient()
        try {
            if (!client) {throw new Error("No peers connected")}
            const gateway = connect({ client, identity, signer })
            this.gatewayCache.set(label, { gateway, client })
            return gateway
        } catch (err: any) {
            console.warn(`Gateway connect via client failed: ${err.message}`)
            throw err
        }
    }

    public async getContract(userLabel: string, contractName: string): Promise<Contract> {
        const gw = await this.getGateway(userLabel)
        const network: Network = gw.getNetwork(this.channelName)
        return network.getContract(this.chaincodeName, contractName)
    }
}
