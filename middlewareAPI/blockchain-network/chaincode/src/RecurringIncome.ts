import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * RecurringIncome model interface.
 */
export interface RecurringIncome {
    id: string;
    userID: string;
    title: string;
    amount: number;
    notes: string;
    recurrenceRule: any;  // Recurrence rule stored as an object.
    date: string;
}

/**
 * Smart contract for managing recurring income records.
 * 
 * NOTE: The client must now supply the recurring income id in the JSON input.
 */
@Info({ title: 'RecurringIncomeContract', notes: 'Smart contract for managing recurring income records' })
export class RecurringIncomeContract extends Contract {
    constructor() {
        super('RecurringIncomeContract');
    }

    /**
     * Produces a deterministic JSON string from a recurring income object.
     */
    private deterministicStringify(income: RecurringIncome): string {
        return stringify(sortKeysRecursive(income));
    }

    private getReccuringIncomeKey(ctx: Context, userID: string, incomeID: string): string {
        return ctx.stub.createCompositeKey('RecurringIncome', [userID, incomeID]);
    }

    /**
     * Create a new recurring income record.
     * 
     * Expects a JSON string representing the entire recurring income object.
     * Required fields in the JSON: id, userID, title, amount, notes, date, recurrenceRule.
     * 
     * @param ctx The transaction context.
     * @param recurringIncomeStr A JSON string representing the recurring income.
     * @returns A JSON string with a message confirming creation.
     */
    @Transaction()
    @Returns('string')
    public async createRecurringIncome(ctx: Context, recurringIncomeStr: string): Promise<string> {
        if (!recurringIncomeStr) {
            throw new Error('Missing recurring income object');
        }

        let incomeInput: any;
        try {
            incomeInput = JSON.parse(recurringIncomeStr);
        } catch (error) {
            throw new Error('Recurring income must be a valid JSON string');
        }

        // Validate required fields, including the id provided by the client
        if (!incomeInput.id || !incomeInput.userID || incomeInput.amount === undefined || !incomeInput.title || !incomeInput.date || !incomeInput.recurrenceRule) {
            throw new Error('Missing required fields: id, userID, title, amount, notes, date, recurrenceRule');
        }

        const amountNum = Number(incomeInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }

        const newRecurringIncome: RecurringIncome = {
            id: incomeInput.id,
            title: incomeInput.title,
            userID: incomeInput.userID,
            amount: amountNum,
            notes: incomeInput.notes,
            date: incomeInput.date,
            recurrenceRule: incomeInput.recurrenceRule,
        };

        const key = this.getReccuringIncomeKey(ctx, incomeInput.userID, incomeInput.id);
        const existing = await ctx.stub.getState(key);
        if (existing && existing.length > 0) {
            throw new Error('Recurring income record already exists');
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(newRecurringIncome)));
        return JSON.stringify({ message: 'Recurring income created' });
    }

    /**
     * Update an existing recurring income record.
     * 
     * Expects a JSON string representing the updated recurring income object.
     * Required fields in the JSON: id, userID, title, amount, notes, date, recurrenceRule.
     *
     * @param ctx The transaction context.
     * @param recurringIncomeStr A JSON string representing the updated recurring income.
     * @returns A JSON string confirming the update.
     */
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

        // Validate required fields for update
        if (!incomeInput.id || !incomeInput.userID || !incomeInput.title ||incomeInput.amount === undefined || !incomeInput.date || !incomeInput.recurrenceRule) {
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

        storedIncome.title = incomeInput.title;
        storedIncome.amount = amountNum;
        storedIncome.notes = incomeInput.notes;
        storedIncome.date = incomeInput.date;
        storedIncome.recurrenceRule = incomeInput.recurrenceRule;

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(storedIncome)));
        return JSON.stringify({ message: 'Recurring income updated' });
    }

    /**
     * Delete a recurring income record.
     * 
     * Expects the recurring income ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param recurringIncomeID The recurring income record identifier.
     * @returns A JSON string confirming deletion.
     */
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

    /**
     * List all recurring income records for a given user.
     * 
     * Expects the userID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param userID The user identifier.
     * @returns A JSON string containing an array of recurring income records.
     */
    @Transaction(false)
    @Returns('string')
    public async listRecurringIncomesByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing user ID');
        }

        const results: RecurringIncome[] = [];
        const iterator = ctx.stub.getStateByPartialCompositeKey('RecurringIncome', [userID]);

        // Use the new async iterator approach.
        for await (const res of iterator) {
            // Each res.value is a Buffer; convert it to a UTF-8 string.
            const incomeStr = res.value.toString();
            const income: RecurringIncome = JSON.parse(incomeStr);
            // The composite key guarantees matching userID, but the check is kept for safety.
            if (income.userID === userID) {
                results.push(income);
            }
        }
        // The iterator is automatically closed when the loop exits.
        return JSON.stringify({ recurringIncomes: results });
    }

    /**
     * Retrieve a specific recurring income record by ID.
     * 
     * Expects the recurring income ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param recurringIncomeID The recurring income record identifier.
     * @returns A JSON string representing the recurring income record.
     */
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

    /**
     * List all recurring income records across all users.
     *
     * This transaction returns every recurring income stored in the ledger.
     *
     * @param ctx The transaction context.
     * @returns A JSON string containing an array of all recurring income records.
     */
    @Transaction(false)
    @Returns('string')
    public async listAllRecurringIncomes(ctx: Context): Promise<string> {
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
