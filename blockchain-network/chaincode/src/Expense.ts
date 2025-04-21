import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

export interface Expense {
    id: string
    userID: string
    title: string
    categoryID: string
    amount: number
    notes: string
    date: string
    receipt?: string
}

@Info({ title: 'ExpenseContract', notes: 'Smart contract for managing expenses' })
export class ExpenseContract extends Contract {
    constructor() {
        super('ExpenseContract')
    }

    private deterministicStringify(expense: Expense): string {
        return stringify(sortKeysRecursive(expense))
    }

    private getExpenseKey(ctx: Context, userID: string, expenseID: string): string {
        return ctx.stub.createCompositeKey('Expense', [userID, expenseID])
    }

    @Transaction()
    @Returns('string')
    public async createExpense(ctx: Context, expenseStr: string): Promise<string> {
        if (!expenseStr) {
            throw new Error('Missing expense object')
        }

        let expenseInput: any
        try {
            expenseInput = JSON.parse(expenseStr)
        } catch (error) {
            throw new Error('Expense must be a valid JSON string')
        }

        if (!expenseInput.id || !expenseInput.userID || !expenseInput.title || !expenseInput.categoryID || expenseInput.amount === undefined || !expenseInput.date) {
            throw new Error('Missing required expense fields: id, userID, title, categoryID, amount, notes, date')
        }

        const amountNum = Number(expenseInput.amount)
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number')
        }

        const newExpense: Expense = {
            id: expenseInput.id,
            userID: expenseInput.userID,
            title: expenseInput.title,
            categoryID: expenseInput.categoryID,
            amount: amountNum,
            notes: expenseInput.notes,
            date: expenseInput.date,
            receipt: expenseInput.receipt
        }

        const key = this.getExpenseKey(ctx, expenseInput.userID, expenseInput.id)
        const existing = await ctx.stub.getState(key)
        if (existing && existing.length > 0) {
            throw new Error('Expense already exists')
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(newExpense)))
        return JSON.stringify({ message: 'Expense created' })
    }

    @Transaction()
    @Returns('string')
    public async updateExpense(ctx: Context, expenseStr: string): Promise<string> {
        if (!expenseStr) {
            throw new Error('Missing expense object')
        }

        let expenseInput: any
        try {
            expenseInput = JSON.parse(expenseStr)
        } catch (error) {
            throw new Error('Expense must be a valid JSON string')
        }

        if (!expenseInput.id || !expenseInput.userID || !expenseInput.title || !expenseInput.categoryID || expenseInput.amount === undefined || !expenseInput.date) {
            throw new Error('Missing required expense fields: id, userID, title, categoryID, amount, notes, date')
        }

        const key = this.getExpenseKey(ctx, expenseInput.userID, expenseInput.id)
        const expenseBytes = await ctx.stub.getState(key)
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Expense does not exist')
        }

        const storedExpense: Expense = JSON.parse(expenseBytes.toString())
        const amountNum = Number(expenseInput.amount)
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number')
        }

        storedExpense.title = expenseInput.title
        storedExpense.categoryID = expenseInput.categoryID
        storedExpense.amount = amountNum
        storedExpense.notes = expenseInput.notes
        storedExpense.date = expenseInput.date
        storedExpense.receipt = expenseInput.receipt

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(storedExpense)))
        return JSON.stringify({ message: 'Expense updated' })
    }

    @Transaction()
    @Returns('string')
    public async deleteExpense(ctx: Context, userID: string, expenseID: string): Promise<string> {
        if (!expenseID || !userID) {
            throw new Error('Missing expense ID')
        }

        const key = this.getExpenseKey(ctx, userID, expenseID)
        const expenseBytes = await ctx.stub.getState(key)
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Expense does not exist')
        }

        await ctx.stub.deleteState(key)
        return JSON.stringify({ message: 'Expense deleted' })
    }

    @Transaction(false)
    @Returns('string')
    public async listExpensesByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing user ID')
        }

        // Adapted to specific context.
        // Hyperledger Fabric, 29/11/2021
        // Website: https://hyperledger.github.io/fabric-chaincode-node/release-2.2/api/tutorial-using-iterators.html
        const results: Expense[] = []
        const iterator = ctx.stub.getStateByPartialCompositeKey('Expense', [userID])

        for await (const res of iterator) {
            if (res.value) {
                const expense: Expense = JSON.parse(res.value.toString())
                if (expense.userID === userID) {
                    results.push(expense)
                }
            }
        }

        return JSON.stringify({ expenses: results })
    }

    @Transaction(false)
    @Returns('string')
    public async getExpenseByID(ctx: Context, userID: string, expenseID: string): Promise<string> {
        if (!expenseID) {
            throw new Error('Missing expense ID')
        }

        const key = this.getExpenseKey(ctx, userID, expenseID)
        const expenseBytes = await ctx.stub.getState(key)
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Expense not found')
        }

        const expense: Expense = JSON.parse(expenseBytes.toString())
        return JSON.stringify(expense)
    }
}
