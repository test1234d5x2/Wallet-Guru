// import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
// import stringify from 'json-stringify-deterministic';
// import sortKeysRecursive from 'sort-keys-recursive';

// interface Expense {
//     ID: string;
//     UserID: string;
//     Title: string;
//     Amount: number;
//     Date: string;
//     Notes: string;
//     CategoryID: string;
//     Receipt?: string;
// }

// @Info({ title: 'ExpenseContract', description: 'Smart contract for managing expenses' })
// export class ExpenseContract extends Contract {
//     private readonly objectType = 'Expense';

//     @Transaction()
//     public async CreateExpense(ctx: Context, id: string, userID: string, title: string, amount: number, date: string, notes: string, categoryID: string, receipt?: string): Promise<void> {
//         const expenseKey = ctx.stub.createCompositeKey(this.objectType, [id]); 
//         const exists = await this.ExpenseExists(ctx, id);
//         if (exists) {
//             throw new Error(`The expense with ID ${id} already exists`);
//         }

//         const expense: Expense = {
//             ID: id,
//             UserID: userID,
//             Title: title,
//             Amount: amount,
//             Date: date,
//             Notes: notes,
//             CategoryID: categoryID,
//             Receipt: receipt || undefined
//         };

//         await ctx.stub.putState(expenseKey, Buffer.from(stringify(sortKeysRecursive(expense))));
//     }

//     @Transaction(false)
//     @Returns('boolean')
//     public async ExpenseExists(ctx: Context, id: string): Promise<boolean> {
//         const expenseKey = ctx.stub.createCompositeKey(this.objectType, [id]); 
//         const expenseJSON = await ctx.stub.getState(expenseKey);
//         return expenseJSON && expenseJSON.length > 0;
//     }

//     @Transaction()
//     public async UpdateExpense(ctx: Context, id: string, userID: string, title: string, amount: number, date: string, notes: string, categoryID: string, receipt?: string): Promise<void> {
//         const expenseKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const exists = await this.ExpenseExists(ctx, id);
//         if (!exists) {
//             throw new Error(`The expense with ID ${id} already exists`);
//         }

//         const updatedExpense: Expense = {
//             ID: id,
//             UserID: userID,
//             Title: title,
//             Amount: amount,
//             Date: date,
//             Notes: notes,
//             CategoryID: categoryID,
//             Receipt: receipt || undefined
//         };

//         await ctx.stub.putState(expenseKey, Buffer.from(stringify(sortKeysRecursive(updatedExpense))));
//     }

//     @Transaction()
//     public async DeleteExpense(ctx: Context, id: string): Promise<void> {
//         const expenseKey = ctx.stub.createCompositeKey(this.objectType, [id]); 
//         const exists = await this.ExpenseExists(ctx, id);
//         if (!exists) {
//             throw new Error(`The expense with ID ${id} already exists`);
//         }
//         await ctx.stub.deleteState(expenseKey);
//     }

//     @Transaction(false)
//     @Returns('Expense[]')
//     public async GetAllExpensesByUser(ctx: Context, userID: string): Promise<Expense[]> {
//         const allExpenses: Expense[] = [];

//         const iterator = await ctx.stub.getStateByPartialCompositeKey(this.objectType, []);
//         let result = await iterator.next();

//         while (!result.done) {
//             const strValue = Buffer.from(result.value.value).toString('utf8');
//             try {
//                 const expense: Expense = JSON.parse(strValue);
//                 if (expense.UserID === userID) {
//                     allExpenses.push(expense);
//                 }
//             } catch (error) {
//                 console.error(`Error parsing expense: ${error}`);
//             }
//             result = await iterator.next();
//         }
//         await iterator.close();
//         return allExpenses;
//     }
// }

import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import { v4 as uuidv4 } from 'uuid';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * Expense model interface.
 */
export interface Expense {
    id: string;
    docType: string;  // Set to "Expense"
    userId: string;
    expenseCategoryId: string;
    amount: number;
    description: string;
    expenseDate: string;
    dateCreated: string;
    dateUpdated?: string;
}

/**
 * Smart contract for managing expenses.
 */
@Info({ title: 'ExpenseContract', description: 'Smart contract for managing expenses' })
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
     * - userId
     * - expenseCategoryId
     * - amount
     * - description
     * - expenseDate
     * The chaincode will generate a new expense id, set docType to "Expense", and record the creation timestamp.
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
        if (!expenseInput.userId || !expenseInput.expenseCategoryId || expenseInput.amount === undefined || !expenseInput.description || !expenseInput.expenseDate) {
            throw new Error('Missing required expense fields: userId, expenseCategoryId, amount, description, expenseDate');
        }
        const expenseId = uuidv4();
        const amountNum = Number(expenseInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }
        const newExpense: Expense = {
            id: expenseId,
            docType: "Expense",
            userId: expenseInput.userId,
            expenseCategoryId: expenseInput.expenseCategoryId,
            amount: amountNum,
            description: expenseInput.description,
            expenseDate: expenseInput.expenseDate,
            dateCreated: new Date().toISOString()
        };

        const existing = await ctx.stub.getState(expenseId);
        if (existing && existing.length > 0) {
            throw new Error('Expense already exists');
        }
        await ctx.stub.putState(expenseId, Buffer.from(this.deterministicStringify(newExpense)));
        return JSON.stringify({ message: 'Expense created', expenseId });
    }

    /**
     * Update an existing expense.
     * Expects a JSON string representing the updated expense object.
     * The expense object must include the following fields:
     * - id
     * - userId
     * - expenseCategoryId
     * - amount
     * - description
     * - expenseDate
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
        if (!expenseInput.id || !expenseInput.userId || !expenseInput.expenseCategoryId || expenseInput.amount === undefined || !expenseInput.description || !expenseInput.expenseDate) {
            throw new Error('Missing required expense fields: id, userId, expenseCategoryId, amount, description, expenseDate');
        }
        const expenseId = expenseInput.id;
        const expenseBytes = await ctx.stub.getState(expenseId);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Expense does not exist');
        }
        const storedExpense: Expense = JSON.parse(expenseBytes.toString());
        const amountNum = Number(expenseInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }
        // Update fields
        storedExpense.expenseCategoryId = expenseInput.expenseCategoryId;
        storedExpense.amount = amountNum;
        storedExpense.description = expenseInput.description;
        storedExpense.expenseDate = expenseInput.expenseDate;
        storedExpense.dateUpdated = new Date().toISOString();

        await ctx.stub.putState(expenseId, Buffer.from(this.deterministicStringify(storedExpense)));
        return JSON.stringify({ message: 'Expense updated' });
    }

    /**
     * Delete an expense.
     * Expects the expense ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param expenseId The expense identifier.
     * @returns A JSON string confirming deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteExpense(ctx: Context, expenseId: string): Promise<string> {
        if (!expenseId) {
            throw new Error('Missing expense ID');
        }
        const expenseBytes = await ctx.stub.getState(expenseId);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Expense does not exist');
        }
        await ctx.stub.deleteState(expenseId);
        return JSON.stringify({ message: 'Expense deleted' });
    }

    /**
     * List all expenses for a given user.
     * Expects the user ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param userId The user identifier.
     * @returns A JSON string containing an array of expenses.
     */
    @Transaction(false)
    @Returns('string')
    public async listExpensesByUser(ctx: Context, userId: string): Promise<string> {
        if (!userId) {
            throw new Error('Missing user ID');
        }
        const query = {
            selector: {
                docType: "Expense",
                userId: userId
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
     * @param expenseId The expense identifier.
     * @returns A JSON string representing the expense.
     */
    @Transaction(false)
    @Returns('string')
    public async getExpenseByID(ctx: Context, expenseId: string): Promise<string> {
        if (!expenseId) {
            throw new Error('Missing expense ID');
        }
        const expenseBytes = await ctx.stub.getState(expenseId);
        if (!expenseBytes || expenseBytes.length === 0) {
            throw new Error('Expense not found');
        }
        const expense: Expense = JSON.parse(expenseBytes.toString());
        return JSON.stringify(expense);
    }
}
