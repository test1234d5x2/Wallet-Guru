import { Wallets, X509Identity } from 'fabric-network'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import FabricCAServices from 'fabric-ca-client'

dotenv.config()

export default async function registerAndEnrollUser(userID: string, adminID: string): Promise<boolean> {
    const CA_URL = process.env.CA_URL
    const CA_TLS_CERT_PATH = process.env.CA_TLS_CERT_PATH
    const ORG_MSP_ID = process.env.MSP_ID
    const WALLET_PATH = process.env.WALLET_PATH

    if (!CA_URL || !CA_TLS_CERT_PATH || !ORG_MSP_ID || !WALLET_PATH) {
        throw new Error("set env variables first")
    }

    const ca = new FabricCAServices(CA_URL, {
        trustedRoots: fs.readFileSync(path.resolve(CA_TLS_CERT_PATH)),
        verify: false,
    })

    const wallet = await Wallets.newFileSystemWallet(path.resolve(WALLET_PATH))

    const userExists = await wallet.get(userID);
    if (userExists) {
        throw new Error(`User "${userID}" already exists in the wallet.`)
    }

    const adminIdentity = await wallet.get(adminID);
    if (!adminIdentity) {
        throw new Error(`Admin identity "${adminID}" not found in the wallet.`)
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)
    const adminUser = await provider.getUserContext(adminIdentity, adminID)

    const secret = await ca.register({
        enrollmentID: userID,
        role: 'client',
        affiliation: '',
    }, adminUser)

    const enrolment = await ca.enroll({
        enrollmentID: userID,
        enrollmentSecret: secret,
    })

    const identity: X509Identity = {
        credentials: {
            certificate: enrolment.certificate,
            privateKey: enrolment.key.toBytes(),
        },
        mspId: ORG_MSP_ID,
        type: 'X.509',
    }

    await wallet.put(userID, identity)
    console.log(`Successfully registered and enrolled user "${userID}".`)
    
    return true
}