import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * RecurringExpense model interface.
 */
export interface RecurringExpense {
    id: string;
    userID: string;
    categoryID: string;
    title: string;
    amount: number;
    notes: string;
    recurrenceRule: any; // Stored as an object (e.g., via BasicRecurrenceRule.toJSON())
    date: string;
}

/**
 * Smart contract for managing recurring expenses.
 * 
 * NOTE: The client must now supply the recurring expense id in the JSON input.
 */
@Info({ title: 'RecurringExpenseContract', notes: 'Smart contract for managing recurring expenses' })
export class RecurringExpenseContract extends Contract {
    constructor() {
        super('RecurringExpenseContract');
    }

    /**
     * Produces a deterministic JSON string from a recurring expense object.
     */
    private deterministicStringify(expense: RecurringExpense): string {
        return stringify(sortKeysRecursive(expense));
    }

    private getReccuringExpenseKey(ctx: Context, userID: string, expenseID: string): string {
        return ctx.stub.createCompositeKey('RecurringExpense', [userID, expenseID]);
    }

    /**
     * Create a new recurring expense.
     * 
     * Expects a JSON string representing the entire recurring expense object.
     * Required fields: id, userID, categoryID, title, amount, notes, date, recurrenceRule.
     * 
     * The chaincode now expects the id to be provided by the client.
     *
     * @param ctx The transaction context.
     * @param recurringExpenseStr A JSON string representing the recurring expense.
     * @returns A JSON string with a message and the new recurring expense's id.
     */
    @Transaction()
    @Returns('string')
    public async createRecurringExpense(ctx: Context, recurringExpenseStr: string): Promise<string> {
        if (!recurringExpenseStr) {
            throw new Error('Missing recurring expense object');
        }

        let expenseInput: any;
        try {
            expenseInput = JSON.parse(recurringExpenseStr);
        } catch (error) {
            throw new Error('Recurring expense must be a valid JSON string');
        }

        // Validate required fields including the id now provided by the client
        if (!expenseInput.id || !expenseInput.userID || !expenseInput.title || !expenseInput.categoryID || expenseInput.amount === undefined || !expenseInput.date || !expenseInput.recurrenceRule) {
            throw new Error('Missing required fields: id, userID, title, categoryID, amount, notes, date, recurrenceRule');
        }

        const amountNum = Number(expenseInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }

        const newRecurringExpense: RecurringExpense = {
            id: expenseInput.id,
            title: expenseInput.title,
            userID: expenseInput.userID,
            categoryID: expenseInput.categoryID,
            amount: amountNum,
            notes: expenseInput.notes,
            date: expenseInput.date,
            recurrenceRule: expenseInput.recurrenceRule,
        };

        const key = this.getReccuringExpenseKey(ctx, expenseInput.userID, expenseInput.id);
        const existing = await ctx.stub.getState(key);
        if (existing && existing.length > 0) {
            throw new Error('Recurring expense already exists');
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(newRecurringExpense)));
        return JSON.stringify({ message: 'Recurring expense created' });
    }

    /**
     * Update an existing recurring expense.
     * 
     * Expects a JSON string representing the updated recurring expense object.
     * Required fields: id, userID, categoryID, title, amount, notes, date, recurrenceRule.
     *
     * @param ctx The transaction context.
     * @param recurringExpenseStr A JSON string representing the updated recurring expense.
     * @returns A JSON string confirming the update.
     */
    @Transaction()
    @Returns('string')
    public async updateRecurringExpense(ctx: Context, recurringExpenseStr: string): Promise<string> {
        if (!recurringExpenseStr) {
            throw new Error('Missing recurring expense object');
        }

        let expenseInput: any;
        try {
            expenseInput = JSON.parse(recurringExpenseStr);
        } catch (error) {
            throw new Error('Recurring expense must be a valid JSON string');
        }

        // Validate required fields for update
        if (!expenseInput.id || !expenseInput.userID || !expenseInput.categoryID || !expenseInput.title || expenseInput.amount === undefined || !expenseInput.date || !expenseInput.recurrenceRule) {
            throw new Error('Missing required fields: id, userID, categoryID, title, amount, notes, date, recurrenceRule');
        }

        const key = this.getReccuringExpenseKey(ctx, expenseInput.userID, expenseInput.id);
        const expenseBytes = await ctx.stub.getState(key);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Recurring expense does not exist');
        }

        const storedExpense: RecurringExpense = JSON.parse(expenseBytes.toString());
        const amountNum = Number(expenseInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }

        storedExpense.title = expenseInput.title;
        storedExpense.categoryID = expenseInput.categoryID;
        storedExpense.amount = amountNum;
        storedExpense.notes = expenseInput.notes;
        storedExpense.date = expenseInput.date;
        storedExpense.recurrenceRule = expenseInput.recurrenceRule;

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(storedExpense)));
        return JSON.stringify({ message: 'Recurring expense updated' });
    }

    /**
     * Delete a recurring expense.
     * 
     * Expects the recurring expense ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param recurringexpenseID The recurring expense record identifier.
     * @returns A JSON string confirming deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteRecurringExpense(ctx: Context, userID: string, recurringexpenseID: string): Promise<string> {
        if (!recurringexpenseID) {
            throw new Error('Missing recurring expense ID');
        }

        const key = this.getReccuringExpenseKey(ctx, userID, recurringexpenseID);
        const expenseBytes = await ctx.stub.getState(key);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Recurring expense does not exist');
        }

        await ctx.stub.deleteState(key);
        return JSON.stringify({ message: 'Recurring expense deleted' });
    }

    /**
     * List all recurring expenses for a given user.
     * 
     * Expects the userID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param userID The user identifier.
     * @returns A JSON string containing an array of recurring expense records.
     */
    @Transaction(false)
    @Returns('string')
    public async listRecurringExpensesByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing user ID');
        }
    
        const results: RecurringExpense[] = [];
        const iterator = ctx.stub.getStateByPartialCompositeKey('RecurringExpense', [userID]);
        
        // Using the new async iterator approach.
        for await (const res of iterator) {
            if (res.value) {
                const expense: RecurringExpense = JSON.parse(res.value.toString());
                // The composite key ensures the records are for the given userID, but check kept for safety.
                if (expense.userID === userID) {
                    results.push(expense);
                }
            }
        }
        // The iterator is automatically closed upon loop exit.
        return JSON.stringify({ recurringExpenses: results });
    }
    
    /**
     * Retrieve a specific recurring expense by ID.
     * 
     * Expects the recurring expense ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param recurringexpenseID The recurring expense record identifier.
     * @returns A JSON string representing the recurring expense record.
     */
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

    /**
     * List all recurring expenses across all users.
     *
     * This transaction returns every recurring expense stored in the ledger.
     *
     * @param ctx The transaction context.
     * @returns A JSON string containing an array of all recurring expense records.
     */
    @Transaction(false)
    @Returns('string')
    public async listAllRecurringExpenses(ctx: Context): Promise<string> {
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
