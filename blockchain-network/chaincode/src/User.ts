import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

@Info({ title: 'UserContract', description: 'User management smart contract' })
export class UserContract extends Contract {
    constructor() {
        super('UserContract')
    }

    private getUserKey(ctx: Context, email: string): string {
        return ctx.stub.createCompositeKey('User', [email])
    }

    private deterministicUser(user: User): string {
        const sortedUser = sortKeysRecursive(user)
        return stringify(sortedUser)
    }

    @Transaction()
    @Returns('string')
    public async createUser(ctx: Context, id: string, email: string, password: string, dateJoined: string): Promise<string> {
        if (!id || !email || !password) {
            throw new Error('ID, email, and password are required')
        }

        const userKey = this.getUserKey(ctx, email)
        const existing = await ctx.stub.getState(userKey)
        if (existing && existing.length > 0) {
            throw new Error('User already exists')
        }

        const newUser: User = {
            id,
            email,
            password,
            dateJoined,
            status: UserStatus.PENDING,
        }

        await ctx.stub.putState(userKey, Buffer.from(this.deterministicUser(newUser)))
        return JSON.stringify({ message: 'User created' })
    }

    @Transaction(false)
    @Returns('string')
    public async loginUser(ctx: Context, email: string, password: string): Promise<string> {
        if (!email || !password) {
            throw new Error('email and password are required')
        }

        const userKey = this.getUserKey(ctx, email)
        const userBytes = await ctx.stub.getState(userKey)
        if (!userBytes || userBytes.length === 0) {
            throw new Error('User does not exist')
        }

        const user: User = JSON.parse(userBytes.toString())
        if (user.password !== password) {
            throw new Error('Invalid credentials')
        }

        return JSON.stringify({ userID: user.id })
    }

    @Transaction()
    @Returns('string')
    public async deleteUser(ctx: Context, email: string): Promise<string> {
        if (!email) {
            throw new Error('Email is required')
        }

        const userKey = this.getUserKey(ctx, email)
        const userBytes = await ctx.stub.getState(userKey)
        if (!userBytes || userBytes.length === 0) {
            throw new Error('User does not exist')
        }

        const user: User = JSON.parse(userBytes.toString())
        if (user.email !== email) {
            throw new Error('Caller not authorized to delete this user')
        }

        await ctx.stub.deleteState(userKey)
        return JSON.stringify({ message: 'User deleted' })
    }

    @Transaction(false)
    @Returns('string')
    public async userExists(ctx: Context, email: string): Promise<string> {
        if (!email) {
            throw new Error('Email is required')
        }

        const userKey = this.getUserKey(ctx, email)
        const userBytes = await ctx.stub.getState(userKey)
        const exists = userBytes && userBytes.length > 0
        return JSON.stringify({ exists })
    }

    @Transaction(false)
    @Returns('string')
    public async findByID(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('User ID is required')
        }

        // Adapted to specific context.
        // Hyperledger Fabric, 29/11/2021
        // Website: https://hyperledger.github.io/fabric-chaincode-node/release-2.2/api/tutorial-using-iterators.html
        const iterator = ctx.stub.getStateByPartialCompositeKey('User', [])
        let foundUser: User | null = null

        for await (const res of iterator) {
            const userStr = res.value.toString()
            const user: User = JSON.parse(userStr)
            if (user.id === userID) {
                foundUser = user
                break
            }
        }
        if (!foundUser) {
            throw new Error('User not found')
        }
        return JSON.stringify(foundUser)
    }

    @Transaction()
    @Returns('string')
    public async changePassword(ctx: Context, email: string, newPassword: string): Promise<string> {
        if (!email || !newPassword) {
            throw new Error('Email and new password are required')
        }

        const userKey = this.getUserKey(ctx, email)
        const userBytes = await ctx.stub.getState(userKey)
        if (!userBytes || userBytes.length === 0) {
            throw new Error('User does not exist')
        }

        const user: User = JSON.parse(userBytes.toString())
        user.password = newPassword

        await ctx.stub.putState(userKey, Buffer.from(this.deterministicUser(user)))
        return JSON.stringify({ message: 'Password updated successfully' })
    }

}

export interface User {
    id: string
    email: string
    password: string
    dateJoined: string
    status: UserStatus
}

export enum UserStatus {
    VERIFIED = 'VERIFIED',
    PENDING = 'PENDING'
}
