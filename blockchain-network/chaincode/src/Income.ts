import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';


@Info({ title: 'IncomeContract', description: 'Smart contract for managing incomes' })
export class IncomeContract extends Contract {
    private readonly objectType = 'Income';

    @Transaction()
    public async CreateIncome(ctx: Context, id: string, userID: string, title: string, amount: number, date: string, notes: string): Promise<void> {
        const incomeKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const exists = await this.IncomeExists(ctx, id);
        if (exists) {
            throw new Error(`The income with ID ${id} already exists`);
        }

        const income = {
            ID: id,
            UserID: userID,
            Title: title,
            Amount: amount,
            Date: date,
            Notes: notes
        };

        await ctx.stub.putState(incomeKey, Buffer.from(stringify(sortKeysRecursive(income))));
    }

    @Transaction(false)
    @Returns('boolean')
    public async IncomeExists(ctx: Context, id: string): Promise<boolean> {
        const incomeKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const incomeJSON = await ctx.stub.getState(incomeKey);
        return incomeJSON && incomeJSON.length > 0;
    }

    @Transaction()
    public async UpdateIncome(ctx: Context, id: string, title: string, amount: number, date: string, notes: string): Promise<void> {
        const incomeKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const exists = await this.IncomeExists(ctx, id);
        if (!exists) {
            throw new Error(`The income with ID ${id} does not exist`);
        }

        const updatedIncome = {
            ID: id,
            Title: title,
            Amount: amount,
            Date: date,
            Notes: notes
        };

        await ctx.stub.putState(incomeKey, Buffer.from(stringify(sortKeysRecursive(updatedIncome))));
    }

    @Transaction()
    public async DeleteIncome(ctx: Context, id: string): Promise<void> {
        const incomeKey = ctx.stub.createCompositeKey(this.objectType, [id]); 
        const exists = await this.IncomeExists(ctx, id);
        if (!exists) {
            throw new Error(`The income with ID ${id} does not exist`);
        }
        await ctx.stub.deleteState(incomeKey);
    }

    @Transaction(false)
    @Returns('Income[]')
    public async GetAllIncomesByUser(ctx: Context, userID: string): Promise<any[]> {
        const allIncomes = [];

        const iterator = await ctx.stub.getStateByPartialCompositeKey(this.objectType, []);
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value).toString('utf8');
            try {
                const income = JSON.parse(strValue)
                if (income.UserID === userID) {
                    allIncomes.push(income);
                }
            } catch (error) {
                console.error(`Error parsing income: ${error}`);
            }
            result = await iterator.next();
        }
        await iterator.close();
        return allIncomes;
    }
}
