import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import { v4 as uuidv4 } from 'uuid';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * Income model interface.
 */
export interface Income {
    id: string;
    userID: string;
    amount: number;
    notes: string;
    date: string;
}

/**
 * Smart contract for managing income records.
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

    /**
     * Create a new income record.
     * 
     * Expects a JSON string representing the entire income object.
     * Required fields in the JSON: userID, amount, notes, date.
     * The chaincode will generate a new id and record the creation timestamp.
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
        if (!incomeInput.userID || incomeInput.amount === undefined || !incomeInput.notes || !incomeInput.date) {
            throw new Error('Missing required fields: userID, amount, notes, date');
        }

        const incomeID = uuidv4();
        const amountNum = Number(incomeInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }

        const newIncome: Income = {
            id: incomeID,
            userID: incomeInput.userID,
            amount: amountNum,
            notes: incomeInput.notes,
            date: new Date(incomeInput.date).toISOString(),
        };

        const existing = await ctx.stub.getState(incomeID);
        if (existing && existing.length > 0) {
            throw new Error('Income record already exists');
        }

        await ctx.stub.putState(incomeID, Buffer.from(this.deterministicStringify(newIncome)));

        return JSON.stringify({ message: 'Income created', incomeID });
    }

    /**
     * Update an existing income record.
     * 
     * Expects a JSON string representing the updated income object.
     * Required fields in the JSON: id, userID, amount, notes, date.
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
        if (!incomeInput.id || !incomeInput.userID || incomeInput.amount === undefined || !incomeInput.notes || !incomeInput.date) {
            throw new Error('Missing required fields: id, userID, amount, notes, date');
        }

        const incomeID = incomeInput.id;
        const incomeBytes = await ctx.stub.getState(incomeID);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record does not exist');
        }

        const storedIncome: Income = JSON.parse(incomeBytes.toString());
        const amountNum = Number(incomeInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }

        // Update fields
        storedIncome.amount = amountNum;
        storedIncome.notes = incomeInput.notes;
        storedIncome.date = new Date(incomeInput.date).toISOString();

        await ctx.stub.putState(incomeID, Buffer.from(this.deterministicStringify(storedIncome)));

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
    public async deleteIncome(ctx: Context, incomeID: string): Promise<string> {
        if (!incomeID) {
            throw new Error('Missing income ID');
        }

        const incomeBytes = await ctx.stub.getState(incomeID);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record does not exist');
        }

        await ctx.stub.deleteState(incomeID);

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

        const query = {
            selector: {
                userID: userID
            }
        };

        const results: Income[] = [];
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value) {
                const income: Income = JSON.parse(result.value.value.toString());
                results.push(income);
            }
            result = await iterator.next();
        }

        await iterator.close();

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
    public async getIncomeByID(ctx: Context, incomeID: string): Promise<string> {
        if (!incomeID) {
            throw new Error('Missing income ID');
        }

        const incomeBytes = await ctx.stub.getState(incomeID);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record not found');
        }
        
        const income: Income = JSON.parse(incomeBytes.toString());
        return JSON.stringify(income);
    }
}
