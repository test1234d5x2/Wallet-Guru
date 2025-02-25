// import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
// import stringify from 'json-stringify-deterministic';
// import sortKeysRecursive from 'sort-keys-recursive';


// @Info({ title: 'GoalContract', description: 'Smart contract for managing goals' })
// export class GoalContract extends Contract {
//     private readonly objectType = 'Goal';

//     @Transaction()
//     public async CreateGoal(ctx: Context, id: string, userID: string, title: string, description: string, target: number, status: string): Promise<void> {
//         const goalKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const exists = await this.GoalExists(ctx, id);
//         if (exists) {
//             throw new Error(`The goal with ID ${id} already exists`);
//         }

//         const goal = {
//             ID: id,
//             UserID: userID,
//             Title: title,
//             Description: description,
//             Target: target,
//             Current: 0,
//             Status: status
//         };

//         await ctx.stub.putState(goalKey, Buffer.from(stringify(sortKeysRecursive(goal))));
//     }

//     @Transaction(false)
//     @Returns('boolean')
//     public async GoalExists(ctx: Context, id: string): Promise<boolean> {
//         const goalKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const goalJSON = await ctx.stub.getState(goalKey);
//         return goalJSON && goalJSON.length > 0;
//     }

//     @Transaction()
//     public async UpdateGoal(ctx: Context, id: string, userID: string, title: string, description: string, target: number, current: number, status: string): Promise<void> {
//         const goalKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const exists = await this.GoalExists(ctx, id);
//         if (!exists) {
//             throw new Error(`The goal with ID ${id} does not exist`);
//         }

//         const updatedGoal = {
//             ID: id,
//             UserID: userID,
//             Title: title,
//             Description: description,
//             Target: target,
//             Current: current,
//             Status: status
//         };

//         await ctx.stub.putState(goalKey, Buffer.from(stringify(sortKeysRecursive(updatedGoal))));
//     }

//     @Transaction()
//     public async DeleteGoal(ctx: Context, id: string): Promise<void> {
//         const goalKey = ctx.stub.createCompositeKey(this.objectType, [id]);
//         const exists = await this.GoalExists(ctx, id);
//         if (!exists) {
//             throw new Error(`The goal with ID ${id} does not exist`);
//         }
//         await ctx.stub.deleteState(goalKey);
//     }

//     @Transaction(false)
//     @Returns('Goal[]')
//     public async GetAllGoalsByUser(ctx: Context, userID: string): Promise<any[]> {
//         const allGoals = [];

//         const iterator = await ctx.stub.getStateByPartialCompositeKey(this.objectType, []);
//         let result = await iterator.next();

//         while (!result.done) {
//             const strValue = Buffer.from(result.value.value).toString('utf8');
//             try {
//                 const goal = JSON.parse(strValue);
//                 if (goal.UserID === userID) {
//                     allGoals.push(goal);
//                 }
//             } catch (error) {
//                 console.error(`Error parsing goal: ${error}`);
//             }
//             result = await iterator.next();
//         }
//         await iterator.close();
//         return allGoals;
//     }
// }





import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
import { v4 as uuidv4 } from 'uuid';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

/**
 * Enum representing the status of a goal.
 */
export enum GoalStatus {
    Active = "Active",
    Archived = "Archived"
}

/**
 * Goal model interface.
 */
export interface Goal {
    id: string;
    userId: string;
    title: string;
    description: string;
    date: string;
    target: number;
    targetDate?: string;
    current?: number;
    status: GoalStatus;
}

/**
 * Smart contract for managing goals.
 */
@Info({ title: 'GoalContract', description: 'Smart contract for managing goals' })
export class GoalContract extends Contract {
    constructor() {
        super('GoalContract');
    }

    /**
     * Helper function to create a composite key for a goal using userId and goalId.
     */
    private getGoalKey(ctx: Context, userId: string, goalId: string): string {
        return ctx.stub.createCompositeKey('Goal', [userId, goalId]);
    }

    /**
     * Deterministically stringify a goal object.
     */
    private deterministicStringify(goal: Goal): string {
        return stringify(sortKeysRecursive(goal));
    }

    /**
     * Create a new goal.
     * @param ctx The transaction context.
     * @param userId The identifier of the user creating the goal.
     * @param title The title of the goal.
     * @param description The description of the goal.
     * @param target The target value (as a string, will be parsed to number).
     * @param targetDate The target date for the goal.
     * @param status The status of the goal (optional; defaults to Active).
     * @returns A JSON string with a message and the new goal's ID.
     */
    @Transaction()
    @Returns('string')
    public async createGoal(ctx: Context, userId: string, title: string, description: string, target: string, targetDate: string, status: string): Promise<string> {
        if (!userId || !title || !description || target === undefined) {
            throw new Error('Missing required fields: userId, title, description, target');
        }
        
        const goalId = uuidv4();
        const targetNum = Number(target);
        if (isNaN(targetNum)) {
            throw new Error('target must be a valid number');
        }
        // Default status to Active if not provided
        const goalStatus: GoalStatus = status ? status as GoalStatus : GoalStatus.Active;

        const newGoal: Goal = {
            id: goalId,
            userId,
            title,
            date: new Date().toISOString(), 
            description,
            target: targetNum,
            targetDate: targetDate || undefined,
            status: goalStatus,
        };

        const key = this.getGoalKey(ctx, userId, goalId);
        const existing = await ctx.stub.getState(key);
        if (existing && existing.length > 0) {
            throw new Error('Goal already exists');
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(newGoal)));
        return JSON.stringify({ message: 'Goal created', goalId });
    }

    /**
     * Update a goal's progress.
     * @param ctx The transaction context.
     * @param userId The identifier of the user.
     * @param goalId The goal identifier.
     * @param current The new current value (as a string, parsed to number).
     * @returns A JSON string confirming the update.
     */
    @Transaction()
    @Returns('string')
    public async updateGoalProgress(ctx: Context, userId: string, goalId: string, current: string): Promise<string> {
        if (!userId || !goalId || current === undefined) {
            throw new Error('Missing required fields: userId, goalId, current');
        }

        const key = this.getGoalKey(ctx, userId, goalId);
        const goalBytes = await ctx.stub.getState(key);
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found');
        }

        const goal: Goal = JSON.parse(goalBytes.toString());
        const currentNum = Number(current);
        if (isNaN(currentNum)) {
            throw new Error('current must be a valid number');
        }
        goal.current = currentNum;

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(goal)));
        return JSON.stringify({ message: 'Goal progress updated' });
    }

    /**
     * Archive a goal by setting its status to Archived.
     * @param ctx The transaction context.
     * @param userId The identifier of the user.
     * @param goalId The goal identifier.
     * @returns A JSON string confirming the goal has been archived.
     */
    @Transaction()
    @Returns('string')
    public async archiveGoal(ctx: Context, userId: string, goalId: string): Promise<string> {
        if (!userId || !goalId) {
            throw new Error('Missing required fields: userId and goalId');
        }

        const key = this.getGoalKey(ctx, userId, goalId);
        const goalBytes = await ctx.stub.getState(key);
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found');
        }

        const goal: Goal = JSON.parse(goalBytes.toString());
        goal.status = GoalStatus.Archived;

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(goal)));
        return JSON.stringify({ message: 'Goal archived' });
    }

    /**
     * Delete a goal.
     * @param ctx The transaction context.
     * @param userId The identifier of the user.
     * @param goalId The goal identifier.
     * @returns A JSON string confirming the goal deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteGoal(ctx: Context, userId: string, goalId: string): Promise<string> {
        if (!userId || !goalId) {
            throw new Error('Missing required fields: userId and goalId');
        }

        const key = this.getGoalKey(ctx, userId, goalId);
        const goalBytes = await ctx.stub.getState(key);
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found');
        }

        await ctx.stub.deleteState(key);
        return JSON.stringify({ message: 'Goal deleted' });
    }

    /**
     * List all goals for a given user.
     * @param ctx The transaction context.
     * @param userId The identifier of the user.
     * @returns A JSON string containing an array of goals.
     */
    @Transaction(false)
    @Returns('string')
    public async listGoalsByUser(ctx: Context, userId: string): Promise<string> {
        if (!userId) {
            throw new Error('Missing required field: userId');
        }
        
        const iterator = await ctx.stub.getStateByPartialCompositeKey('Goal', [userId]);
        const results: Goal[] = [];
        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value && result.value.value.toString()) {
                const goal: Goal = JSON.parse(result.value.value.toString());
                results.push(goal);
            }
            result = await iterator.next();
        }
        await iterator.close();

        return JSON.stringify({ goals: results });
    }

    /**
     * Retrieve a specific goal by its ID.
     * @param ctx The transaction context.
     * @param userId The identifier of the user.
     * @param goalId The goal identifier.
     * @returns A JSON string representing the goal.
     */
    @Transaction(false)
    @Returns('string')
    public async getGoalByID(ctx: Context, userId: string, goalId: string): Promise<string> {
        if (!userId || !goalId) {
            throw new Error('Missing required fields: userId and goalId');
        }

        const key = this.getGoalKey(ctx, userId, goalId);
        const goalBytes = await ctx.stub.getState(key);
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found');
        }

        const goal: Goal = JSON.parse(goalBytes.toString());
        return JSON.stringify(goal);
    }
}
