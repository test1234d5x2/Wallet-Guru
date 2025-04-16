import User from '../models/core/User'
import jwt from 'jsonwebtoken'
import { Contract } from '@hyperledger/fabric-gateway'
import dotenv from 'dotenv'
import { TextDecoder } from 'util'
import registerAndEnrollUser from '../utils/registerAndEnrollUser'

dotenv.config()
const utf8Decoder = new TextDecoder()

class UserService {
    private userContract: Contract
    private JWTSecret: string

    constructor(userContract: Contract) {
        this.userContract = userContract
        this.JWTSecret = process.env.JWT_SECRET || ''
    }

    public async addUser(username: string, password: string): Promise<boolean> {
        const user = new User(username, password)
        const ADMIN_ID = process.env.ADMIN_ID

        if (!ADMIN_ID) {
            console.log("No admin ID set.")
            return false
        }

        try {
            registerAndEnrollUser(username, ADMIN_ID)

            await this.userContract.submitTransaction(
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
            await this.userContract.submitTransaction(
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

            const resultBytes = await this.userContract.evaluateTransaction(
                'loginUser',
                email,
                password
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const userID = result.userID

            const payload = { userID }

            const token = jwt.sign(payload, this.JWTSecret, { expiresIn: '12h', algorithm: 'HS512' })
            return token
        } catch (err) {
            console.log(err)
        }

        return undefined
    }

    public async userExists(email: string): Promise<boolean> {
        try {
            const resultBytes = await this.userContract.evaluateTransaction(
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

    public async findByID(id: string): Promise<User | undefined> {
        try {
            const resultBytes = await this.userContract.evaluateTransaction(
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
            await this.userContract.submitTransaction(
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
