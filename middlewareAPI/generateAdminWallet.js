const { Wallets } = require('fabric-network')
const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config()

async function createAdminWalletIdentity() {
    const WALLET_PATH = process.env.WALLET_PATH
    const ADMIN_SIGNCERT = process.env.ADMIN_SIGNCERT
    const ADMIN_KEYPATH = process.env.ADMIN_KEYPATH
    const MSP_ID = process.env.MSP_ID

    if (!WALLET_PATH || !ADMIN_KEYPATH || !ADMIN_SIGNCERT || !MSP_ID) {
        throw new Error("Set env variables first.")
    }

    const certificate = fs.readFileSync(ADMIN_SIGNCERT, 'utf8')
    const privateKey = fs.readFileSync(ADMIN_KEYPATH, 'utf8')

    const wallet = await Wallets.newFileSystemWallet(WALLET_PATH)

    const identity = {
        credentials: {
            certificate,
            privateKey,
        },
        mspId: MSP_ID,
        type: 'X.509',
    }

    await wallet.put('rca-peerorg-admin', identity)
    console.log("Generated")

    return
}

createAdminWalletIdentity().catch(console.error)