import * as grpc from '@grpc/grpc-js'
import { connect, Gateway, Identity, Signer, signers, Network, Contract } from '@hyperledger/fabric-gateway'
import { promises as fs, readFileSync } from 'fs'
import * as crypto from 'crypto'
import { LRUCache } from 'lru-cache';
import { Wallets, X509Identity, Wallet } from 'fabric-network'
import envOrDefault from '../utils/envOrDefault'
import generatePeerConfigsList from '../utils/generatePeerConfigsList'

export class GatewayManager {
    private clients: grpc.Client[] = []
    private wallet: Wallet
    private channelName: string
    private chaincodeName: string
    private gatewayCache: LRUCache<string, Gateway>

    private constructor(wallet: Wallet) {
        this.channelName = envOrDefault('CHANNEL_NAME', '')
        this.chaincodeName = envOrDefault('CHAINCODE_NAME', '')
        this.wallet = wallet

        this.gatewayCache = new LRUCache<string, Gateway>({
            max: 100,
            ttl: 1000 * 60 * 15,
            ttlAutopurge: true,
            dispose: gw => gw.close(),
        })
    }

    public static async build(): Promise<GatewayManager> {
        const walletPath = envOrDefault('WALLET_PATH', '')
        const wallet = await Wallets.newFileSystemWallet(walletPath)
        const mgr = new GatewayManager(wallet)
        await mgr.initClients()
        return mgr
    }

    private async initClients(): Promise<void> {
        const peerConfigs = generatePeerConfigsList()
        const connectionTimeout = Number(envOrDefault('PEER_CONN_TIMEOUT_MS', '5000'))

        const checks = peerConfigs.map(pc => new Promise<void>(resolve => {
            const tlsRootCert = readFileSync(pc.tlsCertPath)
            const endpoint = pc.url.replace('grpcs://', '')
            const client = new grpc.Client(endpoint,
                grpc.credentials.createSsl(tlsRootCert),
                { 'grpc.ssl_target_name_override': pc.hostAlias })

            client.waitForReady(Date.now() + connectionTimeout, err => {
                if (!err) {
                    console.log(`Connected to peer ${pc.url}`)
                    this.clients.push(client)
                } else {
                    console.warn(`Failed to connect to peer ${pc.url}: ${err.message}`)
                }
                resolve()
            })
        }))

        await Promise.all(checks)

        if (this.clients.length === 0) {
            throw new Error('No available peers after initialization')
        }
    }

    private pickClient(): grpc.Client {
        if (this.clients.length === 0) {
            throw new Error('No available peers to connect')
        }
        const idx = Math.floor(Math.random() * this.clients.length)
        return this.clients[idx]
    }

    public async getGateway(label: string): Promise<Gateway> {
        let gateway = this.gatewayCache.get(label)
        if (gateway) return gateway

        const x509 = (await this.wallet.get(label)) as X509Identity
        if (!x509) throw new Error(`Identity ${label} not found in wallet`)

        const identity: Identity = { mspId: x509.mspId, credentials: Buffer.from(x509.credentials.certificate) }
        const privateKey = crypto.createPrivateKey(x509.credentials.privateKey)
        const signer: Signer = signers.newPrivateKeySigner(privateKey)

        const client = this.pickClient()
        gateway = connect({ client, identity, signer })
        this.gatewayCache.set(label, gateway)
        return gateway
    }

    public async getContract(userLabel: string, contractName: string): Promise<Contract> {
        const gw = await this.getGateway(userLabel)
        const network: Network = gw.getNetwork(this.channelName)
        return network.getContract(this.chaincodeName, contractName)
    }
}
