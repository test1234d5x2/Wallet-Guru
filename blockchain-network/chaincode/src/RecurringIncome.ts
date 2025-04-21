import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

export interface RecurringIncome {
    id: string
    userID: string
    title: string
    amount: number
    categoryID: string
    notes: string
    recurrenceRule: any
    date: string
}

@Info({ title: 'RecurringIncomeContract', notes: 'Smart contract for managing recurring income records' })
export class RecurringIncomeContract extends Contract {
    constructor() {
        super('RecurringIncomeContract')
    }

    private deterministicStringify(income: RecurringIncome): string {
        return stringify(sortKeysRecursive(income))
    }

    private getReccuringIncomeKey(ctx: Context, userID: string, incomeID: string): string {
        return ctx.stub.createCompositeKey('RecurringIncome', [userID, incomeID])
    }

    @Transaction()
    @Returns('string')
    public async createRecurringIncome(ctx: Context, recurringIncomeStr: string): Promise<string> {
        if (!recurringIncomeStr) {
            throw new Error('Missing recurring income object')
        }

        let incomeInput: any
        try {
            incomeInput = JSON.parse(recurringIncomeStr)
        } catch (error) {
            throw new Error('Recurring income must be a valid JSON string')
        }

        if (!incomeInput.id || !incomeInput.userID || incomeInput.amount === undefined || !incomeInput.title || !incomeInput.date || !incomeInput.recurrenceRule || !incomeInput.categoryID) {
            throw new Error('Missing required fields: id, userID, title, amount, notes, date, recurrenceRule')
        }

        const amountNum = Number(incomeInput.amount)
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number')
        }

        const newRecurringIncome: RecurringIncome = {
            id: incomeInput.id,
            title: incomeInput.title,
            userID: incomeInput.userID,
            amount: amountNum,
            categoryID: incomeInput.categoryID,
            notes: incomeInput.notes,
            date: incomeInput.date,
            recurrenceRule: incomeInput.recurrenceRule
        }

        const key = this.getReccuringIncomeKey(ctx, incomeInput.userID, incomeInput.id)
        const existing = await ctx.stub.getState(key)
        if (existing && existing.length > 0) {
            throw new Error('Recurring income record already exists')
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(newRecurringIncome)))
        return JSON.stringify({ message: 'Recurring income created' })
    }

    @Transaction()
    @Returns('string')
    public async updateRecurringIncome(ctx: Context, recurringIncomeStr: string): Promise<string> {
        if (!recurringIncomeStr) {
            throw new Error('Missing recurring income object');
        }

        let incomeInput: any;
        try {
            incomeInput = JSON.parse(recurringIncomeStr);
        } catch (error) {
            throw new Error('Recurring income must be a valid JSON string');
        }

        if (!incomeInput.id || !incomeInput.userID || !incomeInput.title || incomeInput.amount === undefined || !incomeInput.date || !incomeInput.recurrenceRule || !incomeInput.categoryID) {
            throw new Error('Missing required fields: id, userID, title, amount, notes, date, recurrenceRule');
        }

        const key = this.getReccuringIncomeKey(ctx, incomeInput.userID, incomeInput.id);
        const incomeBytes = await ctx.stub.getState(key);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Recurring income record does not exist');
        }

        const storedIncome: RecurringIncome = JSON.parse(incomeBytes.toString());
        const amountNum = Number(incomeInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }

        storedIncome.title = incomeInput.title
        storedIncome.amount = amountNum
        storedIncome.notes = incomeInput.notes
        storedIncome.date = incomeInput.date
        storedIncome.recurrenceRule = incomeInput.recurrenceRule
        storedIncome.categoryID = incomeInput.categoryID

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(storedIncome)));
        return JSON.stringify({ message: 'Recurring income updated' });
    }

    @Transaction()
    @Returns('string')
    public async deleteRecurringIncome(ctx: Context, userID: string, recurringIncomeID: string): Promise<string> {
        if (!recurringIncomeID) {
            throw new Error('Missing recurring income ID');
        }

        const key = this.getReccuringIncomeKey(ctx, userID, recurringIncomeID);
        const incomeBytes = await ctx.stub.getState(key);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Recurring income record does not exist');
        }

        await ctx.stub.deleteState(key);
        return JSON.stringify({ message: 'Recurring income deleted' });
    }

    @Transaction(false)
    @Returns('string')
    public async listRecurringIncomesByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing user ID');
        }

        // Adapted to specific context.
        // Hyperledger Fabric, 29/11/2021
        // Website: https://hyperledger.github.io/fabric-chaincode-node/release-2.2/api/tutorial-using-iterators.html
        const results: RecurringIncome[] = [];
        const iterator = ctx.stub.getStateByPartialCompositeKey('RecurringIncome', [userID]);

        for await (const res of iterator) {
            const incomeStr = res.value.toString();
            const income: RecurringIncome = JSON.parse(incomeStr);
            if (income.userID === userID) {
                results.push(income);
            }
        }

        return JSON.stringify({ recurringIncomes: results });
    }

    @Transaction(false)
    @Returns('string')
    public async getRecurringIncomeByID(ctx: Context, userID: string, recurringIncomeID: string): Promise<string> {
        if (!recurringIncomeID) {
            throw new Error('Missing recurring income ID');
        }

        const key = this.getReccuringIncomeKey(ctx, userID, recurringIncomeID);
        const incomeBytes = await ctx.stub.getState(key);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Recurring income record not found');
        }

        const income: RecurringIncome = JSON.parse(incomeBytes.toString());
        return JSON.stringify(income);
    }

    @Transaction(false)
    @Returns('string')
    public async listAllRecurringIncomes(ctx: Context): Promise<string> {
        // Adapted to specific context.
        // Hyperledger Fabric, 29/11/2021
        // Website: https://hyperledger.github.io/fabric-chaincode-node/release-2.2/api/tutorial-using-iterators.html
        const results: RecurringIncome[] = [];
        const iterator = ctx.stub.getStateByPartialCompositeKey('RecurringIncome', []);

        for await (const res of iterator) {
            if (res.value) {
                const income: RecurringIncome = JSON.parse(res.value.toString());
                results.push(income);
            }
        }
        return JSON.stringify({ recurringIncomes: results });
    }
}
