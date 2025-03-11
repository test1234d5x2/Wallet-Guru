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
            status: UserStatus.PENDING
        }

        await ctx.stub.putState(userKey, Buffer.from(this.deterministicUser(newUser)))
        return JSON.stringify({ message: 'User created' })
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
