import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';


@Info({ title: 'UserContract', description: 'User management smart contract' })
export class UserContract extends Contract {
    private readonly objectType = 'User';

    @Transaction()
    public async CreateUser(ctx: Context, id: string, username: string, password: string): Promise<void> {
        const userKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const exists = await this.UserExists(ctx, id);
        if (exists) {
            throw new Error(`The user with ID ${id} already exists`);
        }

        const user = {
            ID: id,
            Username: username,
            Password: password,
        };

        await ctx.stub.putState(userKey, Buffer.from(stringify(sortKeysRecursive(user))));
    }

    @Transaction(false)
    @Returns('boolean')
    public async UserExists(ctx: Context, id: string): Promise<boolean> {
        const userKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const userJSON = await ctx.stub.getState(userKey);
        return userJSON && userJSON.length > 0;
    }

    @Transaction(false)
    public async AuthenticateUser(ctx: Context, username: string, password: string): Promise<boolean> {
        const allUsers = await this.GetAllUsers(ctx);
        for (const user of allUsers) {
            if (user.Username === username && user.Password === password) {
                return true;
            }
        }
        return false;
    }

    @Transaction(false)
    public async GetUserID(ctx: Context, username: string, password: string): Promise<string> {
        const allUsers = await this.GetAllUsers(ctx);
        for (const user of allUsers) {
            if (user.Username === username && user.Password === password) {
                return user.ID;
            }
        }
        throw new Error('User not found');
    }

    @Transaction()
    public async UpdateUser(ctx: Context, id: string, newUsername: string, newPassword: string): Promise<void> {
        const userKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const exists = await this.UserExists(ctx, id);
        if (!exists) {
            throw new Error(`The user with ID ${id} does not exist`);
        }

        const user = {
            ID: id,
            Username: newUsername,
            Password: newPassword,
        };

        await ctx.stub.putState(userKey, Buffer.from(stringify(sortKeysRecursive(user))));
    }

    @Transaction()
    public async DeleteUser(ctx: Context, id: string): Promise<void> {
        const userKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const exists = await this.UserExists(ctx, id);
        if (!exists) {
            throw new Error(`The user with ID ${id} does not exist`);
        }
        await ctx.stub.deleteState(userKey);
    }

    @Transaction(false)
    @Returns('User[]')
    public async GetAllUsers(ctx: Context): Promise<any[]> {
        const allUsers = [];

        const iterator = await ctx.stub.getStateByPartialCompositeKey(this.objectType, []);
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value).toString('utf8');
            try {
                const user = JSON.parse(strValue);
                allUsers.push(user);
            } catch (error) {
                console.error(`Error parsing user: ${error}`);
            }
            result = await iterator.next();
        }
        await iterator.close();
        return allUsers;
    }
}
