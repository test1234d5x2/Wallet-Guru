import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

export interface RecurringIncome {
    id: string
    userID: string
    title: string
    amount: number
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

        if (!incomeInput.id || !incomeInput.userID || incomeInput.amount === undefined || !incomeInput.title || !incomeInput.date || !incomeInput.recurrenceRule) {
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
}
