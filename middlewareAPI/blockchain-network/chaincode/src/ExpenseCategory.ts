// import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
// import stringify from 'json-stringify-deterministic';
// import sortKeysRecursive from 'sort-keys-recursive';

// interface ExpenseCategory {
//     ID: string;
//     UserID: string;
//     Name: string;
//     MonthlyBudget: number;
// }

// @Info({ title: 'ExpenseCategoryContract', description: 'Smart contract for managing expense categories' })
// export class ExpenseCategoryContract extends Contract {
//     private readonly objectType = 'ExpenseCategory';

//     @Transaction()
//     public async CreateExpenseCategory(ctx: Context, id: string, userID: string, name: string, monthlyBudget: number): Promise<void> {
//         const categoryKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const exists = await this.ExpenseCategoryExists(ctx, id);
//         if (exists) {
//             throw new Error(`The expense category with ID ${id} already exists`);
//         }

//         const expenseCategory: ExpenseCategory = {
//             ID: id,
//             UserID: userID,
//             Name: name,
//             MonthlyBudget: monthlyBudget
//         };

//         await ctx.stub.putState(categoryKey, Buffer.from(stringify(sortKeysRecursive(expenseCategory))));
//     }

//     @Transaction(false)
//     @Returns('boolean')
//     public async ExpenseCategoryExists(ctx: Context, id: string): Promise<boolean> {
//         const categoryKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const categoryJSON = await ctx.stub.getState(categoryKey);
//         return categoryJSON && categoryJSON.length > 0;
//     }

//     @Transaction()
//     public async UpdateExpenseCategory(ctx: Context, id: string, userID: string, name: string, monthlyBudget: number): Promise<void> {
//         const categoryKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const exists = await this.ExpenseCategoryExists(ctx, id);
//         if (!exists) {
//             throw new Error(`The expense category with ID ${id} does not exist`);
//         }

//         const updatedCategory: ExpenseCategory = {
//             ID: id,
//             UserID: userID,
//             Name: name,
//             MonthlyBudget: monthlyBudget
//         };

//         await ctx.stub.putState(categoryKey, Buffer.from(stringify(sortKeysRecursive(updatedCategory))));
//     }

//     @Transaction()
//     public async DeleteExpenseCategory(ctx: Context, id: string): Promise<void> {
//         const categoryKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const exists = await this.ExpenseCategoryExists(ctx, id);
//         if (!exists) {
//             throw new Error(`The expense category with ID ${id} does not exist`);
//         }
//         await ctx.stub.deleteState(categoryKey);
//     }

//     @Transaction(false)
//     @Returns('ExpenseCategory[]')
//     public async GetAllExpenseCategoriesByUser(ctx: Context, userID: string): Promise<ExpenseCategory[]> {
//         const allCategories: ExpenseCategory[] = [];

//         const iterator = await ctx.stub.getStateByPartialCompositeKey(this.objectType, []);
//         let result = await iterator.next();

//         while (!result.done) {
//             const strValue = Buffer.from(result.value.value).toString('utf8');
//             try {
//                 const category: ExpenseCategory = JSON.parse(strValue);
//                 if (category.UserID === userID) {
//                     allCategories.push(category);
//                 }
//             } catch (error) {
//                 console.error(`Error parsing expense category: ${error}`);
//             }
//             result = await iterator.next();
//         }
//         await iterator.close();
//         return allCategories;
//     }
// }


import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import { v4 as uuidv4 } from 'uuid';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * ExpenseCategory model interface.
 */
export interface ExpenseCategory {
    id: string;
    userId: string;
    name: string;
    monthlyBudget: number;
    recurrenceRule: any; // Recurrence rule stored as an object.
    dateCreated: string;
}

/**
 * Smart contract for managing expense categories.
 */
@Info({ title: 'ExpenseCategoryContract', description: 'Smart contract for managing expense categories' })
export class ExpenseCategoryContract extends Contract {
    constructor() {
        super('ExpenseCategoryContract');
    }

    /**
     * Creates a composite key for an expense category using the userId and categoryId.
     */
    private getExpenseCategoryKey(ctx: Context, userId: string, categoryId: string): string {
        return ctx.stub.createCompositeKey('ExpenseCategory', [userId, categoryId]);
    }

    /**
     * Produces a deterministic JSON string from an expense category object.
     */
    private deterministicStringify(expenseCategory: ExpenseCategory): string {
        return stringify(sortKeysRecursive(expenseCategory));
    }

    /**
     * Create a new expense category.
     * Expects a JSON string representing the entire expense category object.
     * Required fields in the JSON: userId, name, monthlyBudget, recurrenceRule.
     * The chaincode will generate a new id and set the creation timestamp.
     *
     * @param ctx The transaction context.
     * @param expenseCategoryStr A JSON string representing the expense category.
     * @returns A JSON string with a message and the new expense category's ID.
     */
    @Transaction()
    @Returns('string')
    public async createExpenseCategory(ctx: Context, expenseCategoryStr: string): Promise<string> {
        if (!expenseCategoryStr) {
            throw new Error('Missing expense category object');
        }
        let expenseCategoryInput: any;
        try {
            expenseCategoryInput = JSON.parse(expenseCategoryStr);
        } catch (error) {
            throw new Error('Expense category must be a valid JSON string');
        }

        // Validate required fields
        if (!expenseCategoryInput.userId || !expenseCategoryInput.name || expenseCategoryInput.monthlyBudget === undefined) {
            throw new Error('Missing required fields: userId, name, monthlyBudget');
        }

        const categoryId = uuidv4();
        const monthlyBudgetNum = Number(expenseCategoryInput.monthlyBudget);
        if (isNaN(monthlyBudgetNum)) {
            throw new Error('monthlyBudget must be a valid number');
        }

        // Parse recurrenceRule if provided (expecting a JSON string)
        let parsedRecurrenceRule = null;
        if (expenseCategoryInput.recurrenceRule) {
            try {
                parsedRecurrenceRule = JSON.parse(expenseCategoryInput.recurrenceRule);
            } catch (error) {
                throw new Error('recurrenceRule must be a valid JSON string');
            }
        }

        const expenseCategory: ExpenseCategory = {
            id: categoryId,
            userId: expenseCategoryInput.userId,
            name: expenseCategoryInput.name,
            monthlyBudget: monthlyBudgetNum,
            recurrenceRule: parsedRecurrenceRule,
            dateCreated: new Date().toISOString()
        };

        const key = this.getExpenseCategoryKey(ctx, expenseCategory.userId, categoryId);
        const existing = await ctx.stub.getState(key);
        if (existing && existing.length > 0) {
            throw new Error('Expense category already exists');
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(expenseCategory)));
        return JSON.stringify({ message: 'Expense category created', expenseCategoryId: categoryId });
    }

    /**
     * Update an existing expense category.
     * Expects a JSON string representing the updated expense category object.
     * Required fields in the JSON: id, userId, name, monthlyBudget, recurrenceRule.
     *
     * @param ctx The transaction context.
     * @param expenseCategoryStr A JSON string representing the updated expense category.
     * @returns A JSON string confirming the update.
     */
    @Transaction()
    @Returns('string')
    public async updateExpenseCategory(ctx: Context, expenseCategoryStr: string): Promise<string> {
        if (!expenseCategoryStr) {
            throw new Error('Missing expense category object');
        }
        let expenseCategoryInput: any;
        try {
            expenseCategoryInput = JSON.parse(expenseCategoryStr);
        } catch (error) {
            throw new Error('Expense category must be a valid JSON string');
        }

        // Validate required fields for update
        if (!expenseCategoryInput.id || !expenseCategoryInput.userId || !expenseCategoryInput.name || expenseCategoryInput.monthlyBudget === undefined) {
            throw new Error('Missing required fields: id, userId, name, monthlyBudget');
        }

        const key = this.getExpenseCategoryKey(ctx, expenseCategoryInput.userId, expenseCategoryInput.id);
        const categoryBytes = await ctx.stub.getState(key);
        if (!categoryBytes || categoryBytes.length === 0) {
            throw new Error('Expense category does not exist');
        }

        const storedExpenseCategory: ExpenseCategory = JSON.parse(categoryBytes.toString());
        storedExpenseCategory.name = expenseCategoryInput.name;

        const monthlyBudgetNum = Number(expenseCategoryInput.monthlyBudget);
        if (isNaN(monthlyBudgetNum)) {
            throw new Error('monthlyBudget must be a valid number');
        }
        storedExpenseCategory.monthlyBudget = monthlyBudgetNum;

        if (expenseCategoryInput.recurrenceRule) {
            try {
                storedExpenseCategory.recurrenceRule = JSON.parse(expenseCategoryInput.recurrenceRule);
            } catch (error) {
                throw new Error('recurrenceRule must be a valid JSON string');
            }
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(storedExpenseCategory)));
        return JSON.stringify({ message: 'Expense category updated' });
    }

    /**
     * Delete an expense category.
     * @param ctx The transaction context.
     * @param userId The identifier of the user.
     * @param categoryId The expense category identifier.
     * @returns A JSON string confirming deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteExpenseCategory(ctx: Context, userId: string, categoryId: string): Promise<string> {
        if (!userId || !categoryId) {
            throw new Error('Missing required fields: userId and categoryId');
        }

        const key = this.getExpenseCategoryKey(ctx, userId, categoryId);
        const categoryBytes = await ctx.stub.getState(key);
        if (!categoryBytes || categoryBytes.length === 0) {
            throw new Error('Expense category does not exist');
        }

        await ctx.stub.deleteState(key);
        return JSON.stringify({ message: 'Expense category deleted' });
    }

    /**
     * List all expense categories for a given user.
     * @param ctx The transaction context.
     * @param userId The identifier of the user.
     * @returns A JSON string containing an array of expense categories.
     */
    @Transaction(false)
    @Returns('string')
    public async listExpenseCategoriesByUser(ctx: Context, userId: string): Promise<string> {
        if (!userId) {
            throw new Error('Missing required field: userId');
        }

        const iterator = await ctx.stub.getStateByPartialCompositeKey('ExpenseCategory', [userId]);
        const results: ExpenseCategory[] = [];
        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value && result.value.value.toString()) {
                const category: ExpenseCategory = JSON.parse(result.value.value.toString());
                results.push(category);
            }
            result = await iterator.next();
        }
        await iterator.close();

        return JSON.stringify({ categories: results });
    }

    /**
     * Retrieve a specific expense category by ID.
     * @param ctx The transaction context.
     * @param userId The identifier of the user.
     * @param categoryId The expense category identifier.
     * @returns A JSON string representing the expense category.
     */
    @Transaction(false)
    @Returns('string')
    public async getExpenseCategoryByID(ctx: Context, userId: string, categoryId: string): Promise<string> {
        if (!userId || !categoryId) {
            throw new Error('Missing required fields: userId and categoryId');
        }

        const key = this.getExpenseCategoryKey(ctx, userId, categoryId);
        const categoryBytes = await ctx.stub.getState(key);
        if (!categoryBytes || categoryBytes.length === 0) {
            throw new Error('Expense category not found');
        }

        const expenseCategory: ExpenseCategory = JSON.parse(categoryBytes.toString());
        return JSON.stringify(expenseCategory);
    }
}
