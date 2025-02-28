import * as grpc from '@grpc/grpc-js';
import { connect, Gateway, hash, Identity, Signer, signers, Network, Contract } from '@hyperledger/fabric-gateway';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';




const mspId = envOrDefault('MSP_ID', 'PeerOrgMSP');

// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', "");

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', "");

// Path to user certificate directory.
const certDirectoryPath = envOrDefault('CERTIFICATE_DIRECTORY_PATH', "");

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERTIFICATE_PATH', "");

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', "");

const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', '');





const channelName = envOrDefault('CHANNEL_NAME', '');
const chaincodeName = envOrDefault('CHAINCODE_NAME', '');
const userContractName = envOrDefault('USER_CONTRACT_NAME', "");
const expenseCategoryContractName = envOrDefault('EXPENSE_CATEGORY_CONTRACT_NAME', "");
const expenseContractName = envOrDefault('EXPENSE_CONTRACT_NAME', "");
const incomeContractName = envOrDefault('INCOME_CONTRACT_NAME', "");
const goalConractName = envOrDefault('GOAL_CONTRACT_NAME', "");
const recurringExpenseContractName = envOrDefault('RECURRING_EXPENSE_CONTRACT_NAME', "");
const recurringIncomeContractName = envOrDefault('RECURRING_INCOME_CONTRACT_NAME', "");




export default class Connection {
    private static instance: Connection;
    private client!: grpc.Client;
    private gateway!: Gateway;
    private network!: Network;


    private constructor() { }

    public static getInstance(): Connection {
        if (!Connection.instance) {
            Connection.instance = new Connection();
        }
        return Connection.instance;
    }

    public async connect() {
        this.client = await this.newGrpcConnection();
        this.gateway = connect({
            client: this.client,
            identity: await this.newIdentity(),
            signer: await this.newSigner(),
            hash: hash.sha256,
            // Default timeouts for different gRPC calls
            evaluateOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            endorseOptions: () => {
                return { deadline: Date.now() + 15000 }; // 15 seconds
            },
            submitOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            commitStatusOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
        });
        this.network = this.gateway.getNetwork(channelName);
    }


    private async newGrpcConnection(): Promise<grpc.Client> {
        const tlsRootCert = await fs.readFile(tlsCertPath);
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        return new grpc.Client(peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': peerHostAlias,
        });
    }

    private async newIdentity(): Promise<Identity> {
        const certPath = await this.getFirstDirFileName(certDirectoryPath);
        const credentials = await fs.readFile(certPath);
        return { mspId, credentials };
    }

    private async getFirstDirFileName(dirPath: string): Promise<string> {
        const files = await fs.readdir(dirPath);
        const file = files[0];
        if (!file) {
            throw new Error(`No files in directory: ${dirPath}`);
        }
        return path.join(dirPath, file);
    }

    private async newSigner(): Promise<Signer> {
        const keyPath = await this.getFirstDirFileName(keyDirectoryPath);
        const privateKeyPem = await fs.readFile(keyPath);
        const privateKey = crypto.createPrivateKey(privateKeyPem);
        return signers.newPrivateKeySigner(privateKey);
    }


    public getUserContract(): Contract { return this.network.getContract(chaincodeName, userContractName); }
    public getExpenseCategoryContract(): Contract { return this.network.getContract(chaincodeName, expenseCategoryContractName); }
    public getExpenseContract(): Contract { return this.network.getContract(chaincodeName, expenseContractName); }
    public getIncomeContract(): Contract { return this.network.getContract(chaincodeName, incomeContractName); }
    public getGoalContract(): Contract { return this.network.getContract(chaincodeName, goalConractName); }
    public getRecurringExpenseContract(): Contract { return this.network.getContract(chaincodeName, recurringExpenseContractName); }
    public getRecurringIncomeContract(): Contract { return this.network.getContract(chaincodeName, recurringIncomeContractName); }
}



function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}




console.log("MSP ID:", mspId);
console.log("Crypto Path:", cryptoPath);
console.log("Key Directory Path:", keyDirectoryPath);
console.log("Certificate Directory Path:", certDirectoryPath);
console.log("TLS Certificate Path:", tlsCertPath);
console.log("Peer Endpoint:", peerEndpoint);
console.log("Peer Host Alias:", peerHostAlias);
console.log("Channel Name:", channelName);
console.log("Chaincode Name:", chaincodeName);
console.log("User Contract Name:", userContractName);
console.log("Expense Category Contract Name:", expenseCategoryContractName);
console.log("Expense Contract Name:", expenseContractName);
console.log("Income Contract Name:", incomeContractName);
console.log("Goal Contract Name:", goalConractName);
console.log("Recurring Expense Contract Name:", recurringExpenseContractName);
console.log("Recurring Income Contract Name:", recurringIncomeContractName);