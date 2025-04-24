import * as grpc from '@grpc/grpc-js'
import { connect, Gateway, Identity, Signer, signers, Contract } from '@hyperledger/fabric-gateway'
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

        // 15 minute Time-To-Live, autopurge removes entries without new requests being sent to the cache.
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

    private async isClientAvailable(client: grpc.Client): Promise<boolean> {
        try {
            await new Promise<void>((res, rej) => {
                client.waitForReady(Date.now() + this.clientTimeout, err => err ? rej(err) : res())
            });
            return true
        } catch {
            return false
        }
    }

    // Sets up the clients for each peer. Clients will be used for the fabric gateway.
    private async initialiseClients(): Promise<void> {
        const newClients: grpc.Client[] = []
        const checks = this.peerConfigs.map(peer => new Promise<void>(resolve => {
            const tlsRootCert = readFileSync(peer.tlsCertPath)
            const endpoint = peer.url.replace('grpcs://', '')
            const client = new grpc.Client(endpoint, grpc.credentials.createSsl(tlsRootCert), { 'grpc.ssl_target_name_override': peer.hostAlias })
            this.isClientAvailable(client).then((connected) => {
                if (connected) {
                    newClients.push(client)
                    console.log(`Connected to peer ${peer.url}`)
                }

                else {
                    console.warn(`Failed to connect to peer ${peer.url}`)
                }
            })
            
            resolve()
        }))

        await Promise.all(checks)
        this.clients = newClients
    }

    private async pickClient(): Promise<grpc.Client | undefined> {
        const now = Date.now()
        const readyClients: grpc.Client[] = []
        for (const client of this.clients) {
            if (await this.isClientAvailable(client)) readyClients.push(client)
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

    // Checks whether a client is available and uses the client to create the fabric gateway object with the crypotgraphic material from the user.
    public async getGateway(label: string): Promise<Gateway> {
        const now = Date.now()
        const cacheEntry = this.gatewayCache.get(label)
        if (cacheEntry) {
            if (await this.isClientAvailable(cacheEntry.client)) {
                return cacheEntry.gateway
            }
            else {
                cacheEntry.gateway.close()
                this.gatewayCache.delete(label)
            }
        }

        const x509 = (await this.wallet.get(label)) as X509Identity
        if (!x509) {
            throw new Error(`Identity ${label} not found in wallet`)
        }

        const identity: Identity = { mspId: x509.mspId, credentials: Buffer.from(x509.credentials.certificate) }
        const privateKey = crypto.createPrivateKey(x509.credentials.privateKey)
        const signer: Signer = signers.newPrivateKeySigner(privateKey)

        const client = await this.pickClient()
        try {
            if (!client) { throw new Error("No peers connected") }
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
        const network = gw.getNetwork(this.channelName)
        return network.getContract(this.chaincodeName, contractName)
    }
}
