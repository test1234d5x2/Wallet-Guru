import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

export interface IncomeCategory {
    id: string
    userID: string
    name: string
    colour: string
}

@Info({ title: 'IncomeCategoryContract', description: 'Smart contract for managing income categories' })
export class IncomeCategoryContract extends Contract {
    constructor() {
        super('IncomeCategoryContract')
    }

    private getIncomeCategoryKey(ctx: Context, userID: string, categoryID: string): string {
        return ctx.stub.createCompositeKey('IncomeCategory', [userID, categoryID])
    }

    private deterministicStringify(incomeCategory: IncomeCategory): string {
        return stringify(sortKeysRecursive(incomeCategory))
    }

    @Transaction()
    @Returns('string')
    public async createIncomeCategory(ctx: Context, incomeCategoryStr: string): Promise<string> {
        if (!incomeCategoryStr) {
            throw new Error('Missing income category object')
        }

        let incomeCategoryInput: any
        try {
            incomeCategoryInput = JSON.parse(incomeCategoryStr)
        } catch (error) {
            throw new Error('Income category must be a valid JSON string')
        }

        if (!incomeCategoryInput.id || !incomeCategoryInput.userID || !incomeCategoryInput.name || !incomeCategoryInput.colour) {
            throw new Error('Missing required fields: id, userID, name, colour')
        }

        const categoryID = incomeCategoryInput.id
        const incomeCategory: IncomeCategory = {
            id: categoryID,
            userID: incomeCategoryInput.userID,
            name: incomeCategoryInput.name,
            colour: incomeCategoryInput.colour
        }

        const key = this.getIncomeCategoryKey(ctx, incomeCategory.userID, categoryID)
        const existing = await ctx.stub.getState(key)
        if (existing && existing.length > 0) {
            throw new Error('Income category already exists')
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(incomeCategory)))
        return JSON.stringify({ message: 'Income category created' })
    }

    @Transaction()
    @Returns('string')
    public async updateIncomeCategory(ctx: Context, incomeCategoryStr: string): Promise<string> {
        if (!incomeCategoryStr) {
            throw new Error('Missing income category object')
        }

        let incomeCategoryInput: any
        try {
            incomeCategoryInput = JSON.parse(incomeCategoryStr)
        } catch (error) {
            throw new Error('Income category must be a valid JSON string')
        }

        if (!incomeCategoryInput.id || !incomeCategoryInput.userID || !incomeCategoryInput.name || !incomeCategoryInput.colour) {
            throw new Error('Missing required fields: id, userID, name, colour')
        }

        const key = this.getIncomeCategoryKey(ctx, incomeCategoryInput.userID, incomeCategoryInput.id)
        const categoryBytes = await ctx.stub.getState(key)
        if (!categoryBytes || categoryBytes.length === 0) {
            throw new Error('Income category does not exist')
        }

        const storedIncomeCategory: IncomeCategory = JSON.parse(categoryBytes.toString())
        storedIncomeCategory.name = incomeCategoryInput.name
        storedIncomeCategory.colour = incomeCategoryInput.colour

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(storedIncomeCategory)))
        return JSON.stringify({ message: 'Income category updated' })
    }

    @Transaction()
    @Returns('string')
    public async deleteIncomeCategory(ctx: Context, userID: string, categoryID: string): Promise<string> {
        if (!userID || !categoryID) {
            throw new Error('Missing required fields: userID and categoryID')
        }

        const key = this.getIncomeCategoryKey(ctx, userID, categoryID)
        const categoryBytes = await ctx.stub.getState(key)
        if (!categoryBytes || categoryBytes.length === 0) {
            throw new Error('Income category does not exist')
        }

        await ctx.stub.deleteState(key)
        return JSON.stringify({ message: 'Income category deleted' })
    }

    @Transaction(false)
    @Returns('string')
    public async listIncomeCategoriesByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing required field: userID')
        }

        const results: IncomeCategory[] = []
        const iterator = ctx.stub.getStateByPartialCompositeKey('IncomeCategory', [userID])

        for await (const res of iterator) {
            if (res.value) {
                const category: IncomeCategory = JSON.parse(res.value.toString())
                results.push(category)
            }
        }

        return JSON.stringify({ categories: results })
    }

    @Transaction(false)
    @Returns('string')
    public async getIncomeCategoryByID(ctx: Context, userID: string, categoryID: string): Promise<string> {
        if (!userID || !categoryID) {
            throw new Error('Missing required fields: userID and categoryID')
        }

        const key = this.getIncomeCategoryKey(ctx, userID, categoryID)
        const categoryBytes = await ctx.stub.getState(key)
        if (!categoryBytes || categoryBytes.length === 0) {
            throw new Error('Income category not found')
        }

        const incomeCategory: IncomeCategory = JSON.parse(categoryBytes.toString())
        return JSON.stringify(incomeCategory)
    }
}
