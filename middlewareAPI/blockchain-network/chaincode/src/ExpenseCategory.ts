import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

export interface ExpenseCategory {
    id: string
    userID: string
    name: string
    monthlyBudget: number
    recurrenceRule: any
    colour: string
}

@Info({ title: 'ExpenseCategoryContract', description: 'Smart contract for managing expense categories' })
export class ExpenseCategoryContract extends Contract {
    constructor() {
        super('ExpenseCategoryContract')
    }

    private getExpenseCategoryKey(ctx: Context, userID: string, categoryID: string): string {
        return ctx.stub.createCompositeKey('ExpenseCategory', [userID, categoryID])
    }

    private deterministicStringify(expenseCategory: ExpenseCategory): string {
        return stringify(sortKeysRecursive(expenseCategory))
    }

    @Transaction()
    @Returns('string')
    public async createExpenseCategory(ctx: Context, expenseCategoryStr: string): Promise<string> {
        if (!expenseCategoryStr) {
            throw new Error('Missing expense category object')
        }

        let expenseCategoryInput: any
        try {
            expenseCategoryInput = JSON.parse(expenseCategoryStr)
        } catch (error) {
            throw new Error('Expense category must be a valid JSON string')
        }

        if (!expenseCategoryInput.id || !expenseCategoryInput.userID || !expenseCategoryInput.name || expenseCategoryInput.monthlyBudget === undefined || !expenseCategoryInput.recurrenceRule || !expenseCategoryInput.colour) {
            throw new Error('Missing required fields: id, userID, name, monthlyBudget, recurrenceRule, colour')
        }

        const categoryID = expenseCategoryInput.id
        const monthlyBudgetNum = Number(expenseCategoryInput.monthlyBudget)
        if (isNaN(monthlyBudgetNum)) {
            throw new Error('monthlyBudget must be a valid number')
        }

        const expenseCategory: ExpenseCategory = {
            id: categoryID,
            userID: expenseCategoryInput.userID,
            name: expenseCategoryInput.name,
            monthlyBudget: monthlyBudgetNum,
            recurrenceRule: expenseCategoryInput.recurrenceRule,
            colour: expenseCategoryInput.colour
        }

        const key = this.getExpenseCategoryKey(ctx, expenseCategory.userID, categoryID)
        const existing = await ctx.stub.getState(key)
        if (existing && existing.length > 0) {
            throw new Error('Expense category already exists')
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(expenseCategory)))
        return JSON.stringify({ message: 'Expense category created' })
    }

    @Transaction()
    @Returns('string')
    public async updateExpenseCategory(ctx: Context, expenseCategoryStr: string): Promise<string> {
        if (!expenseCategoryStr) {
            throw new Error('Missing expense category object')
        }

        let expenseCategoryInput: any
        try {
            expenseCategoryInput = JSON.parse(expenseCategoryStr)
        } catch (error) {
            throw new Error('Expense category must be a valid JSON string')
        }

        if (!expenseCategoryInput.id || !expenseCategoryInput.userID || !expenseCategoryInput.name || expenseCategoryInput.monthlyBudget === undefined || !expenseCategoryInput.recurrenceRule || !expenseCategoryInput.colour) {
            throw new Error('Missing required fields: id, userID, name, monthlyBudget, recurrenceRule, colour')
        }

        const key = this.getExpenseCategoryKey(ctx, expenseCategoryInput.userID, expenseCategoryInput.id)
        const categoryBytes = await ctx.stub.getState(key)
        if (!categoryBytes || categoryBytes.length === 0) {
            throw new Error('Expense category does not exist')
        }

        const storedExpenseCategory: ExpenseCategory = JSON.parse(categoryBytes.toString())
        storedExpenseCategory.name = expenseCategoryInput.name

        const monthlyBudgetNum = Number(expenseCategoryInput.monthlyBudget)
        if (isNaN(monthlyBudgetNum)) {
            throw new Error('monthlyBudget must be a valid number')
        }
        storedExpenseCategory.monthlyBudget = monthlyBudgetNum
        storedExpenseCategory.recurrenceRule = expenseCategoryInput.recurrenceRule
        storedExpenseCategory.colour = expenseCategoryInput.colour

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(storedExpenseCategory)))
        return JSON.stringify({ message: 'Expense category updated' })
    }

    @Transaction()
    @Returns('string')
    public async deleteExpenseCategory(ctx: Context, userID: string, categoryID: string): Promise<string> {
        if (!userID || !categoryID) {
            throw new Error('Missing required fields: userID and categoryID')
        }

        const key = this.getExpenseCategoryKey(ctx, userID, categoryID)
        const categoryBytes = await ctx.stub.getState(key)
        if (!categoryBytes || categoryBytes.length === 0) {
            throw new Error('Expense category does not exist')
        }

        await ctx.stub.deleteState(key)
        return JSON.stringify({ message: 'Expense category deleted' })
    }

    @Transaction(false)
    @Returns('string')
    public async listExpenseCategoriesByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing required field: userID')
        }

        const results: ExpenseCategory[] = []
        const iterator = ctx.stub.getStateByPartialCompositeKey('ExpenseCategory', [userID])

        for await (const res of iterator) {
            if (res.value) {
                const category: ExpenseCategory = JSON.parse(res.value.toString())
                results.push(category)
            }
        }

        return JSON.stringify({ categories: results })
    }

    @Transaction(false)
    @Returns('string')
    public async getExpenseCategoryByID(ctx: Context, userID: string, categoryID: string): Promise<string> {
        if (!userID || !categoryID) {
            throw new Error('Missing required fields: userID and categoryID')
        }

        const key = this.getExpenseCategoryKey(ctx, userID, categoryID)
        const categoryBytes = await ctx.stub.getState(key)
        if (!categoryBytes || categoryBytes.length === 0) {
            throw new Error('Expense category not found')
        }

        const expenseCategory: ExpenseCategory = JSON.parse(categoryBytes.toString())
        return JSON.stringify(expenseCategory)
    }
}
