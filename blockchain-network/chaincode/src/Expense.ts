import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

interface Expense {
    ID: string;
    UserID: string;
    Title: string;
    Amount: number;
    Date: string;
    Notes: string;
    CategoryID: string;
    Receipt?: string;
}

@Info({ title: 'ExpenseContract', description: 'Smart contract for managing expenses' })
export class ExpenseContract extends Contract {
    private readonly objectType = 'Expense';

    @Transaction()
    public async CreateExpense(ctx: Context, id: string, userID: string, title: string, amount: number, date: string, notes: string, categoryID: string, receipt?: string): Promise<void> {
        const expenseKey = ctx.stub.createCompositeKey(this.objectType, [id]); 
        const exists = await this.ExpenseExists(ctx, id);
        if (exists) {
            throw new Error(`The expense with ID ${id} already exists`);
        }

        const expense: Expense = {
            ID: id,
            UserID: userID,
            Title: title,
            Amount: amount,
            Date: date,
            Notes: notes,
            CategoryID: categoryID,
            Receipt: receipt || undefined
        };

        await ctx.stub.putState(expenseKey, Buffer.from(stringify(sortKeysRecursive(expense))));
    }

    @Transaction(false)
    @Returns('boolean')
    public async ExpenseExists(ctx: Context, id: string): Promise<boolean> {
        const expenseKey = ctx.stub.createCompositeKey(this.objectType, [id]); 
        const expenseJSON = await ctx.stub.getState(expenseKey);
        return expenseJSON && expenseJSON.length > 0;
    }

    @Transaction()
    public async UpdateExpense(ctx: Context, id: string, userID: string, title: string, amount: number, date: string, notes: string, categoryID: string, receipt?: string): Promise<void> {
        const expenseKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const exists = await this.ExpenseExists(ctx, id);
        if (!exists) {
            throw new Error(`The expense with ID ${id} already exists`);
        }

        const updatedExpense: Expense = {
            ID: id,
            UserID: userID,
            Title: title,
            Amount: amount,
            Date: date,
            Notes: notes,
            CategoryID: categoryID,
            Receipt: receipt || undefined
        };

        await ctx.stub.putState(expenseKey, Buffer.from(stringify(sortKeysRecursive(updatedExpense))));
    }

    @Transaction()
    public async DeleteExpense(ctx: Context, id: string): Promise<void> {
        const expenseKey = ctx.stub.createCompositeKey(this.objectType, [id]); 
        const exists = await this.ExpenseExists(ctx, id);
        if (!exists) {
            throw new Error(`The expense with ID ${id} already exists`);
        }
        await ctx.stub.deleteState(expenseKey);
    }

    @Transaction(false)
    @Returns('Expense[]')
    public async GetAllExpensesByUser(ctx: Context, userID: string): Promise<Expense[]> {
        const allExpenses: Expense[] = [];

        const iterator = await ctx.stub.getStateByPartialCompositeKey(this.objectType, []);
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value).toString('utf8');
            try {
                const expense: Expense = JSON.parse(strValue);
                if (expense.UserID === userID) {
                    allExpenses.push(expense);
                }
            } catch (error) {
                console.error(`Error parsing expense: ${error}`);
            }
            result = await iterator.next();
        }
        await iterator.close();
        return allExpenses;
    }
}