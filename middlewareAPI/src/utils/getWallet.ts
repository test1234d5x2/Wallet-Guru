import dotenv from 'dotenv'
import { Wallets, X509Identity } from 'fabric-network'
import path from 'path'

dotenv.config()

// Get a user's wallet credentials.
export default async function getWallet(email: string): Promise<string> {
    const WALLET_PATH = process.env.WALLET_PATH

    if (!WALLET_PATH) {
        throw new Error("set env variables first")
    }

    const wallet = await Wallets.newFileSystemWallet(path.resolve(WALLET_PATH))

    const identity = await wallet.get(email)
    if (!identity) {
        throw new Error(`No identity found for user: ${email}`)
    }

    const x509Identity = identity as X509Identity

    const rawIdentity = {
        credentials: {
            certificate: x509Identity.credentials.certificate,
            privateKey: x509Identity.credentials.privateKey,
        },
        mspId: x509Identity.mspId,
        type: x509Identity.type,
    }

    return JSON.stringify(rawIdentity, null, 2)
}
