import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

export interface Income {
    id: string
    userID: string
    title: string
    categoryID: string
    amount: number
    notes: string
    date: string
}

@Info({ title: 'IncomeContract', description: 'Smart contract for managing income records' })
export class IncomeContract extends Contract {
    constructor() {
        super('IncomeContract')
    }

    private deterministicStringify(income: Income): string {
        return stringify(sortKeysRecursive(income))
    }

    private getIncomeKey(ctx: Context, userID: string, incomeID: string): string {
        return ctx.stub.createCompositeKey('Income', [userID, incomeID])
    }

    @Transaction()
    @Returns('string')
    public async createIncome(ctx: Context, incomeStr: string): Promise<string> {
        if (!incomeStr) {
            throw new Error('Missing income object')
        }

        let incomeInput: any
        try {
            incomeInput = JSON.parse(incomeStr)
        } catch (error) {
            throw new Error('Income must be a valid JSON string')
        }

        if (!incomeInput.id || !incomeInput.userID || !incomeInput.title || !incomeInput.categoryID || incomeInput.amount === undefined || !incomeInput.date) {
            throw new Error('Missing required fields: id, userID, title, categoryID, amount, notes, date')
        }

        const amountNum = Number(incomeInput.amount)
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number')
        }

        const newIncome: Income = {
            id: incomeInput.id,
            userID: incomeInput.userID,
            title: incomeInput.title,
            categoryID: incomeInput.categoryID,
            amount: amountNum,
            notes: incomeInput.notes,
            date: incomeInput.date
        }

        const key = this.getIncomeKey(ctx, incomeInput.userID, incomeInput.id)
        const existing = await ctx.stub.getState(key)
        if (existing && existing.length > 0) {
            throw new Error('Income record already exists')
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(newIncome)))
        return JSON.stringify({ message: 'Income created' })
    }

    @Transaction()
    @Returns('string')
    public async updateIncome(ctx: Context, incomeStr: string): Promise<string> {
        if (!incomeStr) {
            throw new Error('Missing income object')
        }

        let incomeInput: any
        try {
            incomeInput = JSON.parse(incomeStr)
        } catch (error) {
            throw new Error('Income must be a valid JSON string')
        }

        if (!incomeInput.id || !incomeInput.userID || !incomeInput.title || !incomeInput.categoryID || incomeInput.amount === undefined || !incomeInput.date) {
            throw new Error('Missing required fields: id, userID, title, categoryID, amount, notes, date')
        }

        const key = this.getIncomeKey(ctx, incomeInput.userID, incomeInput.id)
        const incomeBytes = await ctx.stub.getState(key)
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record does not exist')
        }

        const storedIncome: Income = JSON.parse(incomeBytes.toString())
        const amountNum = Number(incomeInput.amount)
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number')
        }

        storedIncome.title = incomeInput.title
        storedIncome.categoryID = incomeInput.categoryID
        storedIncome.amount = amountNum
        storedIncome.notes = incomeInput.notes
        storedIncome.date = incomeInput.date

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(storedIncome)))
        return JSON.stringify({ message: 'Income updated' })
    }

    @Transaction()
    @Returns('string')
    public async deleteIncome(ctx: Context, userID: string, incomeID: string): Promise<string> {
        if (!incomeID || !userID) {
            throw new Error('Missing income ID')
        }

        const key = this.getIncomeKey(ctx, userID, incomeID)
        const incomeBytes = await ctx.stub.getState(key)
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record does not exist')
        }

        await ctx.stub.deleteState(key)
        return JSON.stringify({ message: 'Income deleted' })
    }

    @Transaction(false)
    @Returns('string')
    public async listIncomesByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing user ID')
        }

        // Adapted to specific context.
        // Hyperledger Fabric, 29/11/2021
        // Website: https://hyperledger.github.io/fabric-chaincode-node/release-2.2/api/tutorial-using-iterators.html
        const results: Income[] = []
        const iterator = ctx.stub.getStateByPartialCompositeKey('Income', [userID])

        for await (const res of iterator) {
            if (res.value) {
                const income: Income = JSON.parse(res.value.toString())
                if (income.userID === userID) {
                    results.push(income)
                }
            }
        }

        return JSON.stringify({ incomes: results })
    }

    @Transaction(false)
    @Returns('string')
    public async getIncomeByID(ctx: Context, userID: string, incomeID: string): Promise<string> {
        if (!incomeID) {
            throw new Error('Missing income ID')
        }

        const key = this.getIncomeKey(ctx, userID, incomeID)
        const incomeBytes = await ctx.stub.getState(key)
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record not found')
        }

        const income: Income = JSON.parse(incomeBytes.toString())
        return JSON.stringify(income)
    }
}
