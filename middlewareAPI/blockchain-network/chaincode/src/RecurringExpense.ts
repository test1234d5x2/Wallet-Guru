import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

export interface RecurringExpense {
    id: string
    userID: string
    categoryID: string
    title: string
    amount: number
    notes: string
    recurrenceRule: any
    date: string
}

@Info({ title: 'RecurringExpenseContract', notes: 'Smart contract for managing recurring expenses' })
export class RecurringExpenseContract extends Contract {
    constructor() {
        super('RecurringExpenseContract')
    }

    private deterministicStringify(expense: RecurringExpense): string {
        return stringify(sortKeysRecursive(expense))
    }

    private getReccuringExpenseKey(ctx: Context, userID: string, expenseID: string): string {
        return ctx.stub.createCompositeKey('RecurringExpense', [userID, expenseID])
    }

    @Transaction()
    @Returns('string')
    public async createRecurringExpense(ctx: Context, recurringExpenseStr: string): Promise<string> {
        if (!recurringExpenseStr) {
            throw new Error('Missing recurring expense object')
        }

        let expenseInput: any
        try {
            expenseInput = JSON.parse(recurringExpenseStr)
        } catch (error) {
            throw new Error('Recurring expense must be a valid JSON string')
        }

        if (!expenseInput.id || !expenseInput.userID || !expenseInput.title || !expenseInput.categoryID || expenseInput.amount === undefined || !expenseInput.date || !expenseInput.recurrenceRule) {
            throw new Error('Missing required fields: id, userID, title, categoryID, amount, notes, date, recurrenceRule')
        }

        const amountNum = Number(expenseInput.amount)
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number')
        }

        const newRecurringExpense: RecurringExpense = {
            id: expenseInput.id,
            title: expenseInput.title,
            userID: expenseInput.userID,
            categoryID: expenseInput.categoryID,
            amount: amountNum,
            notes: expenseInput.notes,
            date: expenseInput.date,
            recurrenceRule: expenseInput.recurrenceRule
        }

        const key = this.getReccuringExpenseKey(ctx, expenseInput.userID, expenseInput.id)
        const existing = await ctx.stub.getState(key)
        if (existing && existing.length > 0) {
            throw new Error('Recurring expense already exists')
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(newRecurringExpense)))
        return JSON.stringify({ message: 'Recurring expense created' })
    }

    @Transaction()
    @Returns('string')
    public async updateRecurringExpense(ctx: Context, recurringExpenseStr: string): Promise<string> {
        if (!recurringExpenseStr) {
            throw new Error('Missing recurring expense object')
        }

        let expenseInput: any
        try {
            expenseInput = JSON.parse(recurringExpenseStr)
        } catch (error) {
            throw new Error('Recurring expense must be a valid JSON string')
        }

        if (!expenseInput.id || !expenseInput.userID || !expenseInput.categoryID || !expenseInput.title || expenseInput.amount === undefined || !expenseInput.date || !expenseInput.recurrenceRule) {
            throw new Error('Missing required fields: id, userID, categoryID, title, amount, notes, date, recurrenceRule')
        }

        const key = this.getReccuringExpenseKey(ctx, expenseInput.userID, expenseInput.id)
        const expenseBytes = await ctx.stub.getState(key)
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Recurring expense does not exist')
        }

        const storedExpense: RecurringExpense = JSON.parse(expenseBytes.toString())
        const amountNum = Number(expenseInput.amount)
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number')
        }

        storedExpense.title = expenseInput.title
        storedExpense.categoryID = expenseInput.categoryID
        storedExpense.amount = amountNum
        storedExpense.notes = expenseInput.notes
        storedExpense.date = expenseInput.date
        storedExpense.recurrenceRule = expenseInput.recurrenceRule

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(storedExpense)))
        return JSON.stringify({ message: 'Recurring expense updated' })
    }

    @Transaction()
    @Returns('string')
    public async deleteRecurringExpense(ctx: Context, userID: string, recurringexpenseID: string): Promise<string> {
        if (!recurringexpenseID) {
            throw new Error('Missing recurring expense ID')
        }

        const key = this.getReccuringExpenseKey(ctx, userID, recurringexpenseID)
        const expenseBytes = await ctx.stub.getState(key)
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Recurring expense does not exist')
        }

        await ctx.stub.deleteState(key)
        return JSON.stringify({ message: 'Recurring expense deleted' })
    }


    @Transaction(false)
    @Returns('string')
    public async listRecurringExpensesByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing user ID');
        }

        // Adapted to specific context.
        // Hyperledger Fabric, 29/11/2021
        // Website: https://hyperledger.github.io/fabric-chaincode-node/release-2.2/api/tutorial-using-iterators.html
        const results: RecurringExpense[] = [];
        const iterator = ctx.stub.getStateByPartialCompositeKey('RecurringExpense', [userID]);

        for await (const res of iterator) {
            if (res.value) {
                const expense: RecurringExpense = JSON.parse(res.value.toString());
                if (expense.userID === userID) {
                    results.push(expense);
                }
            }
        }

        return JSON.stringify({ recurringExpenses: results });
    }

    @Transaction(false)
    @Returns('string')
    public async getRecurringExpenseByID(ctx: Context, userID: string, recurringexpenseID: string): Promise<string> {
        if (!recurringexpenseID) {
            throw new Error('Missing recurring expense ID');
        }

        const key = this.getReccuringExpenseKey(ctx, userID, recurringexpenseID);
        const expenseBytes = await ctx.stub.getState(key);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Recurring expense not found');
        }

        const expense: RecurringExpense = JSON.parse(expenseBytes.toString());
        return JSON.stringify(expense);
    }

    @Transaction(false)
    @Returns('string')
    public async listAllRecurringExpenses(ctx: Context): Promise<string> {
        // Adapted to specific context.
        // Hyperledger Fabric, 29/11/2021
        // Website: https://hyperledger.github.io/fabric-chaincode-node/release-2.2/api/tutorial-using-iterators.html
        const results: RecurringExpense[] = [];
        const iterator = ctx.stub.getStateByPartialCompositeKey('RecurringExpense', []);

        for await (const res of iterator) {
            if (res.value) {
                const expense: RecurringExpense = JSON.parse(res.value.toString());
                results.push(expense);
            }
        }
        return JSON.stringify({ recurringExpenses: results });
    }
}
