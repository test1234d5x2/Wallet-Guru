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
import * as path from 'path'
import * as crypto from 'crypto'

const mspId = envOrDefault('MSP_ID', 'PeerOrgMSP')

const channelName = envOrDefault('CHANNEL_NAME', '')
const chaincodeName = envOrDefault('CHAINCODE_NAME', '')
const userContractName = envOrDefault('USER_CONTRACT_NAME', '')
const expenseCategoryContractName = envOrDefault('EXPENSE_CATEGORY_CONTRACT_NAME', '')
const expenseContractName = envOrDefault('EXPENSE_CONTRACT_NAME', '')
const incomeContractName = envOrDefault('INCOME_CONTRACT_NAME', '')
const goalConractName = envOrDefault('GOAL_CONTRACT_NAME', '')
const recurringExpenseContractName = envOrDefault('RECURRING_EXPENSE_CONTRACT_NAME', '')
const recurringIncomeContractName = envOrDefault('RECURRING_INCOME_CONTRACT_NAME', '')

interface PeerConfig {
    url: string
    tlsCertPath: string
    keyDirectoryPath: string
    certDirectoryPath: string
    hostAlias: string
}

export default class Connection {
    private static instance: Connection
    private gateway!: Gateway
    private network!: Network

    private constructor() { }

    public static getInstance(): Connection {
        if (!Connection.instance) {
            Connection.instance = new Connection()
        }
        return Connection.instance
    }

    public async connect(): Promise<boolean> {
        const peers: PeerConfig[] = []

        for (let x = 1; x <= 2; x++) {
            peers.push({
                url: envOrDefault(`PEER${x}_ENDPOINT`, ''),
                tlsCertPath: envOrDefault(`PEER${x}_TLS_CERTIFICATE_PATH`, ''),
                keyDirectoryPath: envOrDefault(`PEER${x}_KEY_DIRECTORY_PATH`, ''),
                certDirectoryPath: envOrDefault(`PEER${x}_CERTIFICATE_DIRECTORY_PATH`, ''),
                hostAlias: envOrDefault(`PEER${x}_HOST_ALIAS`, '')
            })
        }

        const connectionTimeout = 5000

        try {
            await promiseAny(peers.map(peer => this.tryConnectPeer(peer, connectionTimeout)))
            console.log('Successfully connected to a peer.')
            return true
        } catch (error: any) {
            console.error('Unable to connect to any peer.')
            console.error(`Last error: ${error.message}`)
            return false
        }
    }

    private async tryConnectPeer(peer: PeerConfig, connectionTimeout: number): Promise<boolean> {
        const tlsRootCert = readFileSync(peer.tlsCertPath)
        const endpoint = peer.url.replace('grpcs://', '')
        const client = new grpc.Client(endpoint, grpc.credentials.createSsl(tlsRootCert), {
            'grpc.ssl_target_name_override': peer.hostAlias
        })

        console.log(peer.url)
        return await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                client.close()
                reject(new Error(`Timeout: Failed to connect to ${peer.url} within ${connectionTimeout / 1000} seconds`))
            }, connectionTimeout)

            client.waitForReady(Date.now() + connectionTimeout, async (err) => {
                clearTimeout(timeoutId)
                if (err) {
                    reject(new Error(`Initial connection to ${peer.url} failed: ${err.message}`))
                } else {
                    try {
                        this.gateway = connect({
                            client,
                            identity: await this.newIdentity(peer.certDirectoryPath),
                            signer: await this.newSigner(peer.keyDirectoryPath),
                        })
                        this.network = this.gateway.getNetwork(channelName)
                        resolve(true)
                    } catch (err: any) {
                        reject(new Error(`Failed to connect gateway for peer at ${peer.url}: ${err.message}`))
                    }
                }
            })
        })
    }

    private async newIdentity(certDirectoryPath: string): Promise<Identity> {
        const certPath = await this.getFirstDirFileName(certDirectoryPath)
        const credentials = await fs.readFile(certPath)
        return { mspId, credentials }
    }

    private async getFirstDirFileName(dirPath: string): Promise<string> {
        const files = await fs.readdir(dirPath)
        const file = files[0]
        if (!file) {
            throw new Error(`No files in directory: ${dirPath}`)
        }
        return path.join(dirPath, file)
    }

    private async newSigner(keyDirectoryPath: string): Promise<Signer> {
        const keyPath = await this.getFirstDirFileName(keyDirectoryPath)
        const privateKeyPem = await fs.readFile(keyPath)
        const privateKey = crypto.createPrivateKey(privateKeyPem)
        return signers.newPrivateKeySigner(privateKey)
    }

    public getUserContract(): Contract { return this.network.getContract(chaincodeName, userContractName) }
    public getExpenseCategoryContract(): Contract { return this.network.getContract(chaincodeName, expenseCategoryContractName) }
    public getExpenseContract(): Contract { return this.network.getContract(chaincodeName, expenseContractName) }
    public getIncomeContract(): Contract { return this.network.getContract(chaincodeName, incomeContractName) }
    public getGoalContract(): Contract { return this.network.getContract(chaincodeName, goalConractName) }
    public getRecurringExpenseContract(): Contract { return this.network.getContract(chaincodeName, recurringExpenseContractName) }
    public getRecurringIncomeContract(): Contract { return this.network.getContract(chaincodeName, recurringIncomeContractName) }
}

function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue
}

function promiseAny<T>(promises: Promise<T>[]): Promise<T> {
    return new Promise((resolve, reject) => {
        const errors: any[] = []
        let pending = promises.length
        promises.forEach((p, index) => {
            Promise.resolve(p)
                .then(resolve)
                .catch(error => {
                    errors[index] = error
                    pending = pending - 1
                    if (pending === 0) {
                        reject(new Error('All promises were rejected'))
                    }
                })
        })
    })
}

console.log('MSP ID:', mspId)
console.log('Channel Name:', channelName)
console.log('Chaincode Name:', chaincodeName)
console.log('User Contract Name:', userContractName)
console.log('Expense Category Contract Name:', expenseCategoryContractName)
console.log('Expense Contract Name:', expenseContractName)
console.log('Income Contract Name:', incomeContractName)
console.log('Goal Contract Name:', goalConractName)
console.log('Recurring Expense Contract Name:', recurringExpenseContractName)
console.log('Recurring Income Contract Name:', recurringIncomeContractName)
