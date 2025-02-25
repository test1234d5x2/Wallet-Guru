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
        if (!expenseInput.id || !expenseInput.userID || !expenseInput.title || !expenseInput.categoryID ||
            expenseInput.amount === undefined || !expenseInput.date || !expenseInput.recurrenceRule) {
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
            notes: expenseInput.notes || undefined,
            date: expenseInput.date,
            recurrenceRule: expenseInput.recurrenceRule,
        };

        const existing = await ctx.stub.getState(expenseInput.id);
        if (existing && existing.length > 0) {
            throw new Error('Recurring expense already exists');
        }

        await ctx.stub.putState(expenseInput.id, Buffer.from(this.deterministicStringify(newRecurringExpense)));
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
        if (!expenseInput.id || !expenseInput.userID || !expenseInput.categoryID || !expenseInput.title ||
            expenseInput.amount === undefined || !expenseInput.date || !expenseInput.recurrenceRule) {
            throw new Error('Missing required fields: id, userID, categoryID, title, amount, notes, date, recurrenceRule');
        }

        const expenseBytes = await ctx.stub.getState(expenseInput.id);
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
        storedExpense.notes = expenseInput.notes || undefined;
        storedExpense.date = expenseInput.date;

        await ctx.stub.putState(expenseInput.id, Buffer.from(this.deterministicStringify(storedExpense)));
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
    public async deleteRecurringExpense(ctx: Context, recurringexpenseID: string): Promise<string> {
        if (!recurringexpenseID) {
            throw new Error('Missing recurring expense ID');
        }

        const expenseBytes = await ctx.stub.getState(recurringexpenseID);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Recurring expense does not exist');
        }

        await ctx.stub.deleteState(recurringexpenseID);
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
    
        // Scanning the entire ledger using empty strings for startKey and endKey.
        const startKey = "";
        const endKey = "";
    
        const results: RecurringExpense[] = [];
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value) {
                const expense: RecurringExpense = JSON.parse(result.value.value.toString());
                // Filter the records by userID.
                if (expense.userID === userID) {
                    results.push(expense);
                }
            }
            result = await iterator.next();
        }
        await iterator.close();
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
    public async getRecurringExpenseByID(ctx: Context, recurringexpenseID: string): Promise<string> {
        if (!recurringexpenseID) {
            throw new Error('Missing recurring expense ID');
        }

        const expenseBytes = await ctx.stub.getState(recurringexpenseID);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Recurring expense not found');
        }

        const expense: RecurringExpense = JSON.parse(expenseBytes.toString());
        return JSON.stringify(expense);
    }
}
