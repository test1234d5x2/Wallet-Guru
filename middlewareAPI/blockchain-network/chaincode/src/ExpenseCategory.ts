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

