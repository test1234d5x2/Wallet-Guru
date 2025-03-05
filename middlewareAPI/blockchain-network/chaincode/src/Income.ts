import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * Income model interface.
 */
export interface Income {
    id: string;
    userID: string;
    title: string;
    amount: number;
    notes: string;
    date: string;
}

/**
 * Smart contract for managing income records.
 * 
 * NOTE: The client must supply the income id (and date) in the JSON input.
 */
@Info({ title: 'IncomeContract', description: 'Smart contract for managing income records' })
export class IncomeContract extends Contract {
    constructor() {
        super('IncomeContract');
    }

    /**
     * Deterministically stringify an income object.
     */
    private deterministicStringify(income: Income): string {
        return stringify(sortKeysRecursive(income));
    }

    private getIncomeKey(ctx: Context, userID: string, incomeID: string): string {
        return ctx.stub.createCompositeKey('Income', [userID, incomeID]);
    }

    /**
     * Create a new income record.
     * 
     * Expects a JSON string representing the entire income object.
     * Required fields in the JSON: id, userID, title, amount, notes, date.
     * 
     * The chaincode now expects the id to be provided by the client.
     *
     * @param ctx The transaction context.
     * @param incomeStr A JSON string representing the income.
     * @returns A JSON string with a message and the new income's id.
     */
    @Transaction()
    @Returns('string')
    public async createIncome(ctx: Context, incomeStr: string): Promise<string> {
        if (!incomeStr) {
            throw new Error('Missing income object');
        }

        let incomeInput: any;
        try {
            incomeInput = JSON.parse(incomeStr);
        } catch (error) {
            throw new Error('Income must be a valid JSON string');
        }

        // Validate required fields
        if (!incomeInput.id || !incomeInput.userID || !incomeInput.title || incomeInput.amount === undefined || !incomeInput.date) {
            throw new Error('Missing required fields: id, userID, title, amount, notes, date');
        }

        const amountNum = Number(incomeInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }

        // Use the client-supplied date (which should already be in ISO format)
        const newIncome: Income = {
            id: incomeInput.id,
            title: incomeInput.title,
            userID: incomeInput.userID,
            amount: amountNum,
            notes: incomeInput.notes,
            date: incomeInput.date,
        };

        const key = this.getIncomeKey(ctx, incomeInput.userID, incomeInput.id);
        const existing = await ctx.stub.getState(key);
        if (existing && existing.length > 0) {
            throw new Error('Income record already exists');
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(newIncome)));
        return JSON.stringify({ message: 'Income created' });
    }

    /**
     * Update an existing income record.
     * 
     * Expects a JSON string representing the updated income object.
     * Required fields in the JSON: id, userID, title, amount, notes, date.
     *
     * @param ctx The transaction context.
     * @param incomeStr A JSON string representing the updated income.
     * @returns A JSON string confirming the update.
     */
    @Transaction()
    @Returns('string')
    public async updateIncome(ctx: Context, incomeStr: string): Promise<string> {
        if (!incomeStr) {
            throw new Error('Missing income object');
        }

        let incomeInput: any;
        try {
            incomeInput = JSON.parse(incomeStr);
        } catch (error) {
            throw new Error('Income must be a valid JSON string');
        }

        // Validate required fields for update
        if (!incomeInput.id || !incomeInput.userID || !incomeInput.title || incomeInput.amount === undefined || !incomeInput.date) {
            throw new Error('Missing required fields: id, userID, title, amount, notes, date');
        }

        const key = this.getIncomeKey(ctx, incomeInput.userID, incomeInput.id);
        const incomeBytes = await ctx.stub.getState(key);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record does not exist');
        }

        const storedIncome: Income = JSON.parse(incomeBytes.toString());
        const amountNum = Number(incomeInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }

        // Update fields with client-provided data
        storedIncome.title = incomeInput.title;
        storedIncome.amount = amountNum;
        storedIncome.notes = incomeInput.notes;
        storedIncome.date = incomeInput.date;

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(storedIncome)));
        return JSON.stringify({ message: 'Income updated' });
    }

    /**
     * Delete an income record.
     * 
     * Expects the income ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param incomeID The income record identifier.
     * @returns A JSON string confirming deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteIncome(ctx: Context, userID: string, incomeID: string): Promise<string> {
        if (!incomeID || !userID) {
            throw new Error('Missing income ID');
        }

        const key = this.getIncomeKey(ctx, userID, incomeID);
        const incomeBytes = await ctx.stub.getState(key);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record does not exist');
        }

        await ctx.stub.deleteState(key);
        return JSON.stringify({ message: 'Income deleted' });
    }

    /**
     * List all income records for a given user.
     * 
     * Expects the userID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param userID The user identifier.
     * @returns A JSON string containing an array of income records.
     */
    @Transaction(false)
    @Returns('string')
    public async listIncomesByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing user ID');
        }

        const results: Income[] = [];
        const iterator = ctx.stub.getStateByPartialCompositeKey('Income', [userID]);
        
        // Using the new async iterator approach.
        for await (const res of iterator) {
            if (res.value) {
                const income: Income = JSON.parse(res.value.toString());
                // The composite key ensures the records are for the given userID, but the check is kept for safety.
                if (income.userID === userID) {
                    results.push(income);
                }
            }
        }
        // The iterator is automatically closed upon loop exit.
        return JSON.stringify({ incomes: results });
    }

    /**
     * Retrieve a specific income record by ID.
     * 
     * Expects the income ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param incomeID The income record identifier.
     * @returns A JSON string representing the income record.
     */
    @Transaction(false)
    @Returns('string')
    public async getIncomeByID(ctx: Context, userID: string, incomeID: string): Promise<string> {
        if (!incomeID) {
            throw new Error('Missing income ID');
        }

        const key = this.getIncomeKey(ctx, userID, incomeID);
        const incomeBytes = await ctx.stub.getState(key);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record not found');
        }

        const income: Income = JSON.parse(incomeBytes.toString());
        return JSON.stringify(income);
    }
}
