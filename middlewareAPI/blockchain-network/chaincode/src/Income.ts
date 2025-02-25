// import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
// import stringify from 'json-stringify-deterministic';
// import sortKeysRecursive from 'sort-keys-recursive';


// @Info({ title: 'IncomeContract', description: 'Smart contract for managing incomes' })
// export class IncomeContract extends Contract {
//     private readonly objectType = 'Income';

//     @Transaction()
//     public async CreateIncome(ctx: Context, id: string, userID: string, title: string, amount: number, date: string, notes: string): Promise<void> {
//         const incomeKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const exists = await this.IncomeExists(ctx, id);
//         if (exists) {
//             throw new Error(`The income with ID ${id} already exists`);
//         }

//         const income = {
//             ID: id,
//             UserID: userID,
//             Title: title,
//             Amount: amount,
//             Date: date,
//             Notes: notes
//         };

//         await ctx.stub.putState(incomeKey, Buffer.from(stringify(sortKeysRecursive(income))));
//     }

//     @Transaction(false)
//     @Returns('boolean')
//     public async IncomeExists(ctx: Context, id: string): Promise<boolean> {
//         const incomeKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const incomeJSON = await ctx.stub.getState(incomeKey);
//         return incomeJSON && incomeJSON.length > 0;
//     }

//     @Transaction()
//     public async UpdateIncome(ctx: Context, id: string, title: string, amount: number, date: string, notes: string): Promise<void> {
//         const incomeKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const exists = await this.IncomeExists(ctx, id);
//         if (!exists) {
//             throw new Error(`The income with ID ${id} does not exist`);
//         }

//         const updatedIncome = {
//             ID: id,
//             Title: title,
//             Amount: amount,
//             Date: date,
//             Notes: notes
//         };

//         await ctx.stub.putState(incomeKey, Buffer.from(stringify(sortKeysRecursive(updatedIncome))));
//     }

//     @Transaction()
//     public async DeleteIncome(ctx: Context, id: string): Promise<void> {
//         const incomeKey = ctx.stub.createCompositeKey(this.objectType, [id]); 
//         const exists = await this.IncomeExists(ctx, id);
//         if (!exists) {
//             throw new Error(`The income with ID ${id} does not exist`);
//         }
//         await ctx.stub.deleteState(incomeKey);
//     }

//     @Transaction(false)
//     @Returns('Income[]')
//     public async GetAllIncomesByUser(ctx: Context, userID: string): Promise<any[]> {
//         const allIncomes = [];

//         const iterator = await ctx.stub.getStateByPartialCompositeKey(this.objectType, []);
//         let result = await iterator.next();

//         while (!result.done) {
//             const strValue = Buffer.from(result.value.value).toString('utf8');
//             try {
//                 const income = JSON.parse(strValue)
//                 if (income.UserID === userID) {
//                     allIncomes.push(income);
//                 }
//             } catch (error) {
//                 console.error(`Error parsing income: ${error}`);
//             }
//             result = await iterator.next();
//         }
//         await iterator.close();
//         return allIncomes;
//     }
// }




import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import { v4 as uuidv4 } from 'uuid';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * Income model interface.
 */
export interface Income {
    id: string;
    userId: string;
    amount: number;
    source: string;
    dateReceived: string;
    dateCreated: string;
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
     * Required fields in the JSON: userId, amount, source, dateReceived.
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
        if (!incomeInput.userId || incomeInput.amount === undefined || !incomeInput.source || !incomeInput.dateReceived) {
            throw new Error('Missing required fields: userId, amount, source, dateReceived');
        }
        const incomeId = uuidv4();
        const amountNum = Number(incomeInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }
        const newIncome: Income = {
            id: incomeId,
            userId: incomeInput.userId,
            amount: amountNum,
            source: incomeInput.source,
            dateReceived: incomeInput.dateReceived,
            dateCreated: new Date().toISOString()
        };

        const existing = await ctx.stub.getState(incomeId);
        if (existing && existing.length > 0) {
            throw new Error('Income record already exists');
        }
        await ctx.stub.putState(incomeId, Buffer.from(this.deterministicStringify(newIncome)));
        return JSON.stringify({ message: 'Income created', incomeId });
    }

    /**
     * Update an existing income record.
     * 
     * Expects a JSON string representing the updated income object.
     * Required fields in the JSON: id, userId, amount, source, dateReceived.
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
        if (!incomeInput.id || !incomeInput.userId || incomeInput.amount === undefined || !incomeInput.source || !incomeInput.dateReceived) {
            throw new Error('Missing required fields: id, userId, amount, source, dateReceived');
        }
        const incomeId = incomeInput.id;
        const incomeBytes = await ctx.stub.getState(incomeId);
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
        storedIncome.source = incomeInput.source;
        storedIncome.dateReceived = incomeInput.dateReceived;

        await ctx.stub.putState(incomeId, Buffer.from(this.deterministicStringify(storedIncome)));
        return JSON.stringify({ message: 'Income updated' });
    }

    /**
     * Delete an income record.
     * 
     * Expects the income ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param incomeId The income record identifier.
     * @returns A JSON string confirming deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteIncome(ctx: Context, incomeId: string): Promise<string> {
        if (!incomeId) {
            throw new Error('Missing income ID');
        }
        const incomeBytes = await ctx.stub.getState(incomeId);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record does not exist');
        }
        await ctx.stub.deleteState(incomeId);
        return JSON.stringify({ message: 'Income deleted' });
    }

    /**
     * List all income records for a given user.
     * 
     * Expects the userId to be passed directly.
     *
     * @param ctx The transaction context.
     * @param userId The user identifier.
     * @returns A JSON string containing an array of income records.
     */
    @Transaction(false)
    @Returns('string')
    public async listIncomesByUser(ctx: Context, userId: string): Promise<string> {
        if (!userId) {
            throw new Error('Missing user ID');
        }
        const query = {
            selector: {
                userId: userId
            }
        };
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        const results: Income[] = [];
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
     * @param incomeId The income record identifier.
     * @returns A JSON string representing the income record.
     */
    @Transaction(false)
    @Returns('string')
    public async getIncomeByID(ctx: Context, incomeId: string): Promise<string> {
        if (!incomeId) {
            throw new Error('Missing income ID');
        }
        const incomeBytes = await ctx.stub.getState(incomeId);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Income record not found');
        }
        const income: Income = JSON.parse(incomeBytes.toString());
        return JSON.stringify(income);
    }
}
