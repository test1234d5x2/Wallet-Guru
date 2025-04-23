/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// Modified to fit the structure of the custom-made blockchain network.
// Date Accessed: 2/4/2025
// Website: https://github.com/hyperledger/fabric-samples/blob/main/asset-transfer-basic/application-gateway-typescript/src/app.ts

import * as grpc from '@grpc/grpc-js'
import { connect, Gateway, Identity, Signer, signers, Network, Contract } from '@hyperledger/fabric-gateway'
import { promises as fs, readFileSync } from 'fs'
import * as crypto from 'crypto'
import { LRUCache } from 'lru-cache';
import { Wallets, X509Identity } from 'fabric-network'
import envOrDefault from '../utils/envOrDefault'
import generatePeerConfigsList from '../utils/generatePeerConfigsList'


export class GatewayManager {
    private client: grpc.Client;
    private wallet: ReturnType<typeof Wallets.newFileSystemWallet>;
    private channelName: string
    private chaincodeName: string

    private gatewayCache: LRUCache<string, Gateway>;

    constructor() {
        this.channelName = envOrDefault('CHANNEL_NAME', '')
        this.chaincodeName = envOrDefault('CHAINCODE_NAME', '')

        const peers = generatePeerConfigsList()
        const peer = peers[0]
        const tlsRootCert = readFileSync(peer.tlsCertPath);
        const endpoint = peer.url.replace('grpcs://', '');
        this.client = new grpc.Client(endpoint, grpc.credentials.createSsl(tlsRootCert), {
            'grpc.ssl_target_name_override': peer.hostAlias,
        });

        const walletPath = process.env.WALLET_PATH!
        this.wallet = Wallets.newFileSystemWallet(walletPath);

        this.gatewayCache = new LRUCache<string, Gateway>({
            ttl: 1000 * 60 * 15,
            ttlAutopurge: true,
            dispose: (gw, label) => gw.close(),
        });
    }

    public async getGateway(label: string): Promise<Gateway> {
        let gateway = this.gatewayCache.get(label);
        if (gateway) {
            return gateway;
        }

        const x509 = await (await this.wallet).get(label) as X509Identity
        if (!x509) throw new Error(`Identity ${label} not found in wallet`);

        const identity: Identity = { mspId: x509.mspId, credentials: Buffer.from(x509.credentials.certificate) };
        const privateKey = crypto.createPrivateKey(x509.credentials.privateKey);
        const signer: Signer = signers.newPrivateKeySigner(privateKey);

        gateway = connect({ client: this.client, identity, signer });
        this.gatewayCache.set(label, gateway);
        return gateway;
    }

    public async getContract(userLabel: string, contractName: string): Promise<Contract> {
        const gw = await this.getGateway(userLabel);
        const network: Network = gw.getNetwork(this.channelName);
        return network.getContract(this.chaincodeName, contractName);
    }
}
