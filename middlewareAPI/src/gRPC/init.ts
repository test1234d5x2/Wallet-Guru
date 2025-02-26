import * as grpc from '@grpc/grpc-js';
import { connect, Gateway, hash, Identity, Signer, signers, Network, Contract } from '@hyperledger/fabric-gateway';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';




const mspId = envOrDefault('MSP_ID', 'PeerOrgMSP');

// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', 'fabric-ca', 'peerorg'));

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'peer1', 'msp', 'keystore'));

// Path to user certificate directory.
const certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'peer1', 'msp', 'signcerts'));

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peer1', 'tls-msp', 'tlscacerts', 'tls-0-0-0-0-7052.pem'));

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer1-peerorg');





const channelName = envOrDefault('CHANNEL_NAME', 'expensechannel');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
const userContractName = "UserContract";
const expenseCategoryContractName = "ExpenseCategoryContract";
const expenseContractName = "ExpenseContract";
const incomeContractName = "IncomeContract";
const goalConractName = "GoalContract";
const recurringExpenseContractName = "RecurringExpenseContract";
const recurringIncomeContractName = "RecurringIncomeContract";




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