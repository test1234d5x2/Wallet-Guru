import User from '../models/core/User'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { TextDecoder } from 'util'
import registerAndEnrollUser from '../utils/registerAndEnrollUser'
import { GatewayManager } from '../gRPC/init-new'

dotenv.config()
const utf8Decoder = new TextDecoder()

class UserService {
    private userContractName: string
    private JWTSecret: string
    private gm: GatewayManager

    constructor(gm: GatewayManager) {
        const USER_CONTRACT_NAME = process.env.USER_CONTRACT_NAME
        const JWT_SECRET = process.env.JWT_SECRET

        if (!USER_CONTRACT_NAME || !JWT_SECRET) {
            throw new Error("Set env variables")
        }

        this.userContractName = USER_CONTRACT_NAME || ''
        this.JWTSecret = JWT_SECRET || ''
        this.gm = gm
    }

    public async addUser(email: string, password: string): Promise<boolean> {
        const user = new User(email, password)
        const ADMIN_ID = process.env.ADMIN_ID

        if (!ADMIN_ID) {
            console.log("No admin ID set.")
            return false
        }

        try {
            registerAndEnrollUser(email, ADMIN_ID)

            const userContract = await this.gm.getContract(ADMIN_ID, this.userContractName)
            await userContract.submitTransaction(
                'createUser',
                user.getUserID(),
                user.getEmail(),
                user.getPassword(),
                user.getDateJoined().toISOString()
            )

            return true
        } catch (err) {
            console.log(err)
        }

        return false
    }

    public async deleteUser(email: string): Promise<boolean> {
        try {
            const userContract = await this.gm.getContract(email, this.userContractName)
            await userContract.submitTransaction(
                'deleteUser',
                email
            )

            return true
        } catch (err) {
            console.log(err)
        }

        return false
    }

    public async authenticateUser(email: string, password: string): Promise<string | undefined> {
        try {
            if (this.JWTSecret === '') {
                throw new Error('Server Error')
            }

            const userContract = await this.gm.getContract(email, this.userContractName)
            const resultBytes = await userContract.evaluateTransaction(
                'loginUser',
                email,
                password
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const userID = result.userID

            const payload = { userID, email }

            const token = jwt.sign(payload, this.JWTSecret, { expiresIn: '12h', algorithm: 'HS512' })
            return token
        } catch (err) {
            console.log(err)
        }

        return undefined
    }

    public async userExists(email: string): Promise<boolean> {
        try {
            const userContract = await this.gm.getContract(email, this.userContractName)
            const resultBytes = await userContract.evaluateTransaction(
                'userExists',
                email
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            return result.exists
        } catch (err) {
            console.log(err)
        }

        return false
    }

    public async findByID(email: string, id: string): Promise<User | undefined> {
        try {
            const userContract = await this.gm.getContract(email, this.userContractName)
            const resultBytes = await userContract.evaluateTransaction(
                'findByID',
                id
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const data = JSON.parse(resultJson)

            return new User(data.email, data.password, data.id, new Date(data.dateJoined), data.status)
        } catch (err) {
            console.log(err)
        }

        return undefined
    }

    public async changePassword(email: string, newPassword: string): Promise<boolean> {
        try {
            const userContract = await this.gm.getContract(email, this.userContractName)
            await userContract.submitTransaction(
                'changePassword',
                email,
                newPassword
            )
            return true
        } catch (err) {
            console.log(err)
        }

        return false
    }
}

export default UserService
