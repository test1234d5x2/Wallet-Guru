import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import { v4 as uuidv4 } from 'uuid';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * RecurringExpense model interface.
 */
export interface RecurringExpense {
    id: string;
    userId: string;
    expenseCategoryId: string;
    amount: number;
    description: string;
    startDate: string;
    recurrenceRule: any; // Stored as an object (e.g., via BasicRecurrenceRule.toJSON())
    dateCreated: string;
}

/**
 * Smart contract for managing recurring expenses.
 */
@Info({ title: 'RecurringExpenseContract', description: 'Smart contract for managing recurring expenses' })
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
     * Required fields: userId, expenseCategoryId, amount, description, startDate, recurrenceRule.
     * The chaincode will generate a new id and set the creation timestamp.
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
        // Validate required fields
        if (!expenseInput.userId || !expenseInput.expenseCategoryId || expenseInput.amount === undefined ||
            !expenseInput.description || !expenseInput.startDate || !expenseInput.recurrenceRule) {
            throw new Error('Missing required fields: userId, expenseCategoryId, amount, description, startDate, recurrenceRule');
        }
        const expenseId = uuidv4();
        const amountNum = Number(expenseInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }
        // Parse the recurrenceRule, which is provided as a JSON string
        let parsedRecurrenceRule: any;
        try {
            parsedRecurrenceRule = JSON.parse(expenseInput.recurrenceRule);
        } catch (error) {
            throw new Error('recurrenceRule must be a valid JSON string');
        }

        const newRecurringExpense: RecurringExpense = {
            id: expenseId,
            userId: expenseInput.userId,
            expenseCategoryId: expenseInput.expenseCategoryId,
            amount: amountNum,
            description: expenseInput.description,
            startDate: expenseInput.startDate,
            recurrenceRule: parsedRecurrenceRule,
            dateCreated: new Date().toISOString()
        };

        const existing = await ctx.stub.getState(expenseId);
        if (existing && existing.length > 0) {
            throw new Error('Recurring expense already exists');
        }
        await ctx.stub.putState(expenseId, Buffer.from(this.deterministicStringify(newRecurringExpense)));
        return JSON.stringify({ message: 'Recurring expense created', recurringExpenseId: expenseId });
    }

    /**
     * Update an existing recurring expense.
     * 
     * Expects a JSON string representing the updated recurring expense object.
     * Required fields: id, userId, expenseCategoryId, amount, description, startDate, recurrenceRule.
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
        if (!expenseInput.id || !expenseInput.userId || !expenseInput.expenseCategoryId ||
            expenseInput.amount === undefined || !expenseInput.description || !expenseInput.startDate || !expenseInput.recurrenceRule) {
            throw new Error('Missing required fields: id, userId, expenseCategoryId, amount, description, startDate, recurrenceRule');
        }
        const expenseId = expenseInput.id;
        const expenseBytes = await ctx.stub.getState(expenseId);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Recurring expense does not exist');
        }
        const storedExpense: RecurringExpense = JSON.parse(expenseBytes.toString());
        const amountNum = Number(expenseInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }
        let parsedRecurrenceRule: any;
        try {
            parsedRecurrenceRule = JSON.parse(expenseInput.recurrenceRule);
        } catch (error) {
            throw new Error('recurrenceRule must be a valid JSON string');
        }
        // Update fields
        storedExpense.expenseCategoryId = expenseInput.expenseCategoryId;
        storedExpense.amount = amountNum;
        storedExpense.description = expenseInput.description;
        storedExpense.startDate = expenseInput.startDate;
        storedExpense.recurrenceRule = parsedRecurrenceRule;
        // dateCreated remains unchanged.
        await ctx.stub.putState(expenseId, Buffer.from(this.deterministicStringify(storedExpense)));
        return JSON.stringify({ message: 'Recurring expense updated' });
    }

    /**
     * Delete a recurring expense.
     * 
     * Expects the recurring expense ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param recurringExpenseId The recurring expense record identifier.
     * @returns A JSON string confirming deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteRecurringExpense(ctx: Context, recurringExpenseId: string): Promise<string> {
        if (!recurringExpenseId) {
            throw new Error('Missing recurring expense ID');
        }
        const expenseBytes = await ctx.stub.getState(recurringExpenseId);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Recurring expense does not exist');
        }
        await ctx.stub.deleteState(recurringExpenseId);
        return JSON.stringify({ message: 'Recurring expense deleted' });
    }

    /**
     * List all recurring expenses for a given user.
     * 
     * Expects the userId to be passed directly.
     *
     * @param ctx The transaction context.
     * @param userId The user identifier.
     * @returns A JSON string containing an array of recurring expense records.
     */
    @Transaction(false)
    @Returns('string')
    public async listRecurringExpensesByUser(ctx: Context, userId: string): Promise<string> {
        if (!userId) {
            throw new Error('Missing user ID');
        }
        const query = {
            selector: {
                userId: userId
            }
        };
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        const results: RecurringExpense[] = [];
        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value) {
                const expense: RecurringExpense = JSON.parse(result.value.value.toString());
                results.push(expense);
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
     * @param recurringExpenseId The recurring expense record identifier.
     * @returns A JSON string representing the recurring expense record.
     */
    @Transaction(false)
    @Returns('string')
    public async getRecurringExpenseByID(ctx: Context, recurringExpenseId: string): Promise<string> {
        if (!recurringExpenseId) {
            throw new Error('Missing recurring expense ID');
        }
        const expenseBytes = await ctx.stub.getState(recurringExpenseId);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Recurring expense not found');
        }
        const expense: RecurringExpense = JSON.parse(expenseBytes.toString());
        return JSON.stringify(expense);
    }
}
