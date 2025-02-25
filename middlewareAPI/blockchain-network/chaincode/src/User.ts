import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import { v4 as uuidv4 } from 'uuid';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

// Provide metadata for this smart contract.
@Info({ title: 'UserContract', description: 'User management smart contract' })
export class UserContract extends Contract {
    constructor() {
        super('UserContract');
    }

    /**
     * Helper function that returns a composite key for a user based on the email.
     */
    private getUserKey(ctx: Context, email: string): string {
        return ctx.stub.createCompositeKey('User', [email]);
    }

    /**
     * Helper to produce a deterministic JSON string of the user object.
     * It first recursively sorts the keys and then stringifies deterministically.
     */
    private deterministicUser(user: User): string {
        const sortedUser = sortKeysRecursive(user);
        return stringify(sortedUser);
    }

    /**
     * Create a new user.
     * @param ctx The transaction context.
     * @param email The user's email.
     * @param password The user's password.
     * @returns A JSON string with a message and the new user's ID.
     */
    @Transaction()
    @Returns('string')
    public async createUser(ctx: Context, email: string, password: string): Promise<string> {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const userKey = this.getUserKey(ctx, email);
        const existing = await ctx.stub.getState(userKey);
        if (existing && existing.length > 0) {
            throw new Error('User already exists');
        }

        const id = uuidv4();
        const newUser: User = {
            id,
            email,
            password, // Note: In production, store a hashed password!
            dateJoined: new Date().toISOString(),
            status: UserStatus.PENDING,
        };

        await ctx.stub.putState(userKey, Buffer.from(this.deterministicUser(newUser)));
        return JSON.stringify({ message: 'User created'});
    }

    /**
     * Authenticate a user.
     * @param ctx The transaction context.
     * @param email The user's email/email.
     * @param password The user's password.
     * @returns A JSON string with a success message and a dummy token.
     */
    @Transaction(false) // Query (read-only) transaction.
    @Returns('string')
    public async loginUser(ctx: Context, email: string, password: string): Promise<string> {
        if (!email || !password) {
            throw new Error('email and password are required');
        }

        const userKey = this.getUserKey(ctx, email);
        const userBytes = await ctx.stub.getState(userKey);
        if (!userBytes || userBytes.length === 0) {
            throw new Error('User does not exist');
        }

        const user: User = JSON.parse(userBytes.toString());
        if (user.password !== password) {
            throw new Error('Invalid credentials');
        }

        return JSON.stringify({ message: 'Login successful' });
    }

    /**
     * Delete a user.
     * @param ctx The transaction context.
     * @param email The email of the user to delete.
     * @returns A JSON string confirming deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteUser(ctx: Context, email: string): Promise<string> {
        if (!email) {
            throw new Error('Email is required');
        }

        const userKey = this.getUserKey(ctx, email);
        const userBytes = await ctx.stub.getState(userKey);
        if (!userBytes || userBytes.length === 0) {
            throw new Error('User does not exist');
        }

        const user: User = JSON.parse(userBytes.toString());
        if (user.email !== email) {
            throw new Error('Caller not authorized to delete this user');
        }

        await ctx.stub.deleteState(userKey);
        return JSON.stringify({ message: 'User deleted' });
    }
}

// User model interface
export interface User {
    id: string;
    email: string;
    password: string;
    dateJoined: string;
    status: UserStatus;
}

// Enum for user status.
export enum UserStatus {
    VERIFIED = 'VERIFIED',
    PENDING = 'PENDING'
}
