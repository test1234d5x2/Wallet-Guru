import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import { v4 as uuidv4 } from 'uuid';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * Expense model interface.
 */
export interface Expense {
    id: string;
    userID: string;
    categoryID: string;
    amount: number;
    notes: string;
    date: string;
}

/**
 * Smart contract for managing expenses.
 */
@Info({ title: 'ExpenseContract', notes: 'Smart contract for managing expenses' })
export class ExpenseContract extends Contract {
    constructor() {
        super('ExpenseContract');
    }

    /**
     * Deterministically stringify an expense object.
     */
    private deterministicStringify(expense: Expense): string {
        return stringify(sortKeysRecursive(expense));
    }

    /**
     * Create a new expense.
     * Expects a JSON string representing the expense object with these fields:
     * - userID
     * - categoryID
     * - amount
     * - notes
     * - date
     * The chaincode will generate a new expense id, and record the creation timestamp.
     *
     * @param ctx The transaction context.
     * @param expenseStr A JSON string representing the expense.
     * @returns A JSON string with a message and the new expense's id.
     */
    @Transaction()
    @Returns('string')
    public async createExpense(ctx: Context, expenseStr: string): Promise<string> {
        if (!expenseStr) {
            throw new Error('Missing expense object');
        }

        let expenseInput: any;
        try {
            expenseInput = JSON.parse(expenseStr);
        } catch (error) {
            throw new Error('Expense must be a valid JSON string');
        }

        // Validate required fields
        if (!expenseInput.userID || !expenseInput.categoryID || expenseInput.amount === undefined || !expenseInput.notes || !expenseInput.date) {
            throw new Error('Missing required expense fields: userID, categoryID, amount, notes, date');
        }

        const expenseID = uuidv4();
        const amountNum = Number(expenseInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }
        const newExpense: Expense = {
            id: expenseID,
            userID: expenseInput.userID,
            categoryID: expenseInput.categoryID,
            amount: amountNum,
            notes: expenseInput.notes,
            date: expenseInput.date,
        };

        const existing = await ctx.stub.getState(expenseID);
        if (existing && existing.length > 0) {
            throw new Error('Expense already exists');
        }
        await ctx.stub.putState(expenseID, Buffer.from(this.deterministicStringify(newExpense)));
        return JSON.stringify({ message: 'Expense created' });
    }

    /**
     * Update an existing expense.
     * Expects a JSON string representing the updated expense object.
     * The expense object must include the following fields:
     * - id
     * - userID
     * - categoryID
     * - amount
     * - notes
     * - date
     *
     * @param ctx The transaction context.
     * @param expenseStr A JSON string representing the updated expense.
     * @returns A JSON string confirming the update.
     */
    @Transaction()
    @Returns('string')
    public async updateExpense(ctx: Context, expenseStr: string): Promise<string> {
        if (!expenseStr) {
            throw new Error('Missing expense object');
        }

        let expenseInput: any;
        try {
            expenseInput = JSON.parse(expenseStr);
        } catch (error) {
            throw new Error('Expense must be a valid JSON string');
        }

        // Validate required fields for update
        if (!expenseInput.id || !expenseInput.userID || !expenseInput.categoryID || expenseInput.amount === undefined || !expenseInput.notes || !expenseInput.date) {
            throw new Error('Missing required expense fields: id, userID, categoryID, amount, notes, date');
        }

        const expenseID = expenseInput.id;
        const expenseBytes = await ctx.stub.getState(expenseID);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Expense does not exist');
        }

        const storedExpense: Expense = JSON.parse(expenseBytes.toString());
        const amountNum = Number(expenseInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }

        storedExpense.categoryID = expenseInput.categoryID;
        storedExpense.amount = amountNum;
        storedExpense.notes = expenseInput.notes;
        storedExpense.date = expenseInput.date;

        await ctx.stub.putState(expenseID, Buffer.from(this.deterministicStringify(storedExpense)));
        return JSON.stringify({ message: 'Expense updated' });
    }

    /**
     * Delete an expense.
     * Expects the expense ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param expenseID The expense identifier.
     * @returns A JSON string confirming deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteExpense(ctx: Context, expenseID: string): Promise<string> {
        if (!expenseID) {
            throw new Error('Missing expense ID');
        }

        const expenseBytes = await ctx.stub.getState(expenseID);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Expense does not exist');
        }

        await ctx.stub.deleteState(expenseID);

        return JSON.stringify({ message: 'Expense deleted' });
    }

    /**
     * List all expenses for a given user.
     * Expects the user ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param userID The user identifier.
     * @returns A JSON string containing an array of expenses.
     */
    @Transaction(false)
    @Returns('string')
    public async listExpensesByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing user ID');
        }

        const query = {
            selector: {
                docType: "Expense",
                userID: userID
            }
        };

        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        const results: Expense[] = [];

        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value) {
                const expense: Expense = JSON.parse(result.value.value.toString());
                results.push(expense);
            }
            result = await iterator.next();
        }

        await iterator.close();

        return JSON.stringify({ expenses: results });
    }

    /**
     * Retrieve a specific expense by ID.
     * Expects the expense ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param expenseID The expense identifier.
     * @returns A JSON string representing the expense.
     */
    @Transaction(false)
    @Returns('string')
    public async getExpenseByID(ctx: Context, expenseID: string): Promise<string> {
        if (!expenseID) {
            throw new Error('Missing expense ID');
        }

        const expenseBytes = await ctx.stub.getState(expenseID);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Expense not found');
        }
        
        const expense: Expense = JSON.parse(expenseBytes.toString());
        return JSON.stringify(expense);
    }
}
