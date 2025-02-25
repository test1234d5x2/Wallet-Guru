import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import { v4 as uuidv4 } from 'uuid';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * RecurringIncome model interface.
 */
export interface RecurringIncome {
    id: string;
    userId: string;
    incomeCategoryId: string;
    amount: number;
    description: string;
    startDate: string;
    recurrenceRule: any;  // Recurrence rule stored as an object.
    dateCreated: string;
}

/**
 * Smart contract for managing recurring income records.
 */
@Info({ title: 'RecurringIncomeContract', description: 'Smart contract for managing recurring income records' })
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

    /**
     * Create a new recurring income record.
     * 
     * Expects a JSON string representing the entire recurring income object.
     * Required fields in the JSON: userId, incomeCategoryId, amount, description, startDate, recurrenceRule.
     * The chaincode generates a new id and sets the creation timestamp.
     *
     * @param ctx The transaction context.
     * @param recurringIncomeStr A JSON string representing the recurring income.
     * @returns A JSON string with a message and the new recurring income's id.
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
        // Validate required fields
        if (!incomeInput.userId || !incomeInput.incomeCategoryId || incomeInput.amount === undefined ||
            !incomeInput.description || !incomeInput.startDate || !incomeInput.recurrenceRule) {
            throw new Error('Missing required fields: userId, incomeCategoryId, amount, description, startDate, recurrenceRule');
        }
        const incomeId = uuidv4();
        const amountNum = Number(incomeInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }
        // Parse the recurrenceRule, which is provided as a JSON string
        let parsedRecurrenceRule: any;
        try {
            parsedRecurrenceRule = JSON.parse(incomeInput.recurrenceRule);
        } catch (error) {
            throw new Error('recurrenceRule must be a valid JSON string');
        }

        const newRecurringIncome: RecurringIncome = {
            id: incomeId,
            userId: incomeInput.userId,
            incomeCategoryId: incomeInput.incomeCategoryId,
            amount: amountNum,
            description: incomeInput.description,
            startDate: incomeInput.startDate,
            recurrenceRule: parsedRecurrenceRule,
            dateCreated: new Date().toISOString()
        };

        const existing = await ctx.stub.getState(incomeId);
        if (existing && existing.length > 0) {
            throw new Error('Recurring income record already exists');
        }
        await ctx.stub.putState(incomeId, Buffer.from(this.deterministicStringify(newRecurringIncome)));
        return JSON.stringify({ message: 'Recurring income created', recurringIncomeId: incomeId });
    }

    /**
     * Update an existing recurring income record.
     * 
     * Expects a JSON string representing the updated recurring income object.
     * Required fields in the JSON: id, userId, incomeCategoryId, amount, description, startDate, recurrenceRule.
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
        if (!incomeInput.id || !incomeInput.userId || !incomeInput.incomeCategoryId ||
            incomeInput.amount === undefined || !incomeInput.description || !incomeInput.startDate || !incomeInput.recurrenceRule) {
            throw new Error('Missing required fields: id, userId, incomeCategoryId, amount, description, startDate, recurrenceRule');
        }
        const incomeId = incomeInput.id;
        const incomeBytes = await ctx.stub.getState(incomeId);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Recurring income record does not exist');
        }
        const storedIncome: RecurringIncome = JSON.parse(incomeBytes.toString());
        const amountNum = Number(incomeInput.amount);
        if (isNaN(amountNum)) {
            throw new Error('amount must be a valid number');
        }
        let parsedRecurrenceRule: any;
        try {
            parsedRecurrenceRule = JSON.parse(incomeInput.recurrenceRule);
        } catch (error) {
            throw new Error('recurrenceRule must be a valid JSON string');
        }
        // Update fields
        storedIncome.incomeCategoryId = incomeInput.incomeCategoryId;
        storedIncome.amount = amountNum;
        storedIncome.description = incomeInput.description;
        storedIncome.startDate = incomeInput.startDate;
        storedIncome.recurrenceRule = parsedRecurrenceRule;

        await ctx.stub.putState(incomeId, Buffer.from(this.deterministicStringify(storedIncome)));
        return JSON.stringify({ message: 'Recurring income updated' });
    }

    /**
     * Delete a recurring income record.
     * 
     * Expects the recurring income ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param recurringIncomeId The recurring income record identifier.
     * @returns A JSON string confirming deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteRecurringIncome(ctx: Context, recurringIncomeId: string): Promise<string> {
        if (!recurringIncomeId) {
            throw new Error('Missing recurring income ID');
        }
        const incomeBytes = await ctx.stub.getState(recurringIncomeId);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Recurring income record does not exist');
        }
        await ctx.stub.deleteState(recurringIncomeId);
        return JSON.stringify({ message: 'Recurring income deleted' });
    }

    /**
     * List all recurring income records for a given user.
     * 
     * Expects the userId to be passed directly.
     *
     * @param ctx The transaction context.
     * @param userId The user identifier.
     * @returns A JSON string containing an array of recurring income records.
     */
    @Transaction(false)
    @Returns('string')
    public async listRecurringIncomesByUser(ctx: Context, userId: string): Promise<string> {
        if (!userId) {
            throw new Error('Missing user ID');
        }
        const query = {
            selector: {
                userId: userId
            }
        };
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        const results: RecurringIncome[] = [];
        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value) {
                const income: RecurringIncome = JSON.parse(result.value.value.toString());
                results.push(income);
            }
            result = await iterator.next();
        }
        await iterator.close();
        return JSON.stringify({ recurringIncomes: results });
    }

    /**
     * Retrieve a specific recurring income record by ID.
     * 
     * Expects the recurring income ID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param recurringIncomeId The recurring income record identifier.
     * @returns A JSON string representing the recurring income record.
     */
    @Transaction(false)
    @Returns('string')
    public async getRecurringIncomeByID(ctx: Context, recurringIncomeId: string): Promise<string> {
        if (!recurringIncomeId) {
            throw new Error('Missing recurring income ID');
        }
        const incomeBytes = await ctx.stub.getState(recurringIncomeId);
        if (!incomeBytes || incomeBytes.length === 0) {
            throw new Error('Recurring income record not found');
        }
        const income: RecurringIncome = JSON.parse(incomeBytes.toString());
        return JSON.stringify(income);
    }
}
