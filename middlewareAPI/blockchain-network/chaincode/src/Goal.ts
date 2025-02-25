import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api';
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
    userID: string;
    title: string;
    description: string;
    target: number;
    targetDate: string;
    current: number;
    status: GoalStatus;
}

/**
 * Smart contract for managing goals.
 * 
 * NOTE: The client must supply the goal id in the JSON input.
 */
@Info({ title: 'GoalContract', description: 'Smart contract for managing goals' })
export class GoalContract extends Contract {
    constructor() {
        super('GoalContract');
    }

    /**
     * Produces a deterministic JSON string from a goal object.
     */
    private deterministicStringify(goal: Goal): string {
        return stringify(sortKeysRecursive(goal));
    }

    /**
     * Create a new goal.
     * 
     * Expects a JSON string representing the entire goal object.
     * Required fields: id, userID, title, description, target, targetDate.
     * The chaincode expects the id to be provided by the client.
     * It initializes current to 0 and sets status to Active if not provided.
     *
     * @param ctx The transaction context.
     * @param goalStr A JSON string representing the goal.
     * @returns A JSON string with a message and the new goal's id.
     */
    @Transaction()
    @Returns('string')
    public async createGoal(ctx: Context, goalStr: string): Promise<string> {
        if (!goalStr) {
            throw new Error('Missing goal object');
        }

        let goalInput: any;
        try {
            goalInput = JSON.parse(goalStr);
        } catch (error) {
            throw new Error('Goal must be a valid JSON string');
        }

        // Validate required fields
        if (!goalInput.id || !goalInput.userID || !goalInput.title || !goalInput.description || goalInput.target === undefined || !goalInput.targetDate) {
            throw new Error('Missing required fields: id, userID, title, description, target, targetDate');
        }

        const targetNum = Number(goalInput.target);
        if (isNaN(targetNum)) {
            throw new Error('target must be a valid number');
        }

        const newGoal: Goal = {
            id: goalInput.id,
            userID: goalInput.userID,
            title: goalInput.title,
            description: goalInput.description,
            target: targetNum,
            targetDate: goalInput.targetDate,
            current: 0,
            status: goalInput.status ? goalInput.status as GoalStatus : GoalStatus.Active,
        };

        const existing = await ctx.stub.getState(goalInput.id);
        if (existing && existing.length > 0) {
            throw new Error('Goal already exists');
        }

        await ctx.stub.putState(goalInput.id, Buffer.from(this.deterministicStringify(newGoal)));
        return JSON.stringify({ message: 'Goal created' });
    }

    /**
     * Update a goal's current progress.
     * 
     * Expects the goal ID and the new current value.
     *
     * @param ctx The transaction context.
     * @param goalID The goal identifier.
     * @param current The new current value (as a string, will be parsed to a number).
     * @returns A JSON string confirming the update.
     */
    @Transaction()
    @Returns('string')
    public async updateGoal(ctx: Context, goalID: string, current: string): Promise<string> {
        if (!goalID || current === undefined) {
            throw new Error('Missing required fields: goalID and current');
        }

        const goalBytes = await ctx.stub.getState(goalID);
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found');
        }

        const goal: Goal = JSON.parse(goalBytes.toString());
        const currentNum = Number(current);
        if (isNaN(currentNum)) {
            throw new Error('current must be a valid number');
        }
        
        goal.current = currentNum;

        await ctx.stub.putState(goalID, Buffer.from(this.deterministicStringify(goal)));
        return JSON.stringify({ message: 'Goal progress updated' });
    }

    /**
     * Archive a goal by setting its status to Archived.
     * 
     * Expects the goalID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param goalID The goal identifier.
     * @returns A JSON string confirming that the goal has been archived.
     */
    @Transaction()
    @Returns('string')
    public async archiveGoal(ctx: Context, goalID: string): Promise<string> {
        if (!goalID) {
            throw new Error('Missing required field: goalID');
        }

        const goalBytes = await ctx.stub.getState(goalID);
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found');
        }

        const goal: Goal = JSON.parse(goalBytes.toString());
        goal.status = GoalStatus.Archived;
        
        await ctx.stub.putState(goalID, Buffer.from(this.deterministicStringify(goal)));
        return JSON.stringify({ message: 'Goal archived' });
    }

    /**
     * Delete a goal.
     * 
     * Expects the goalID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param goalID The goal identifier.
     * @returns A JSON string confirming the deletion.
     */
    @Transaction()
    @Returns('string')
    public async deleteGoal(ctx: Context, goalID: string): Promise<string> {
        if (!goalID) {
            throw new Error('Missing required field: goalID');
        }

        const goalBytes = await ctx.stub.getState(goalID);
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found');
        }

        await ctx.stub.deleteState(goalID);
        return JSON.stringify({ message: 'Goal deleted' });
    }

    /**
     * List all goals for a given user.
     * 
     * Expects the userID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param userID The user identifier.
     * @returns A JSON string containing an array of goals.
     */
    @Transaction(false)
    @Returns('string')
    public async listGoalsByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing required field: userID');
        }

        const query = {
            selector: {
                userID: userID
            }
        };

        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        const results: Goal[] = [];
        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value) {
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
     * 
     * Expects the goalID to be passed directly.
     *
     * @param ctx The transaction context.
     * @param goalID The goal identifier.
     * @returns A JSON string representing the goal.
     */
    @Transaction(false)
    @Returns('string')
    public async getGoalByID(ctx: Context, goalID: string): Promise<string> {
        if (!goalID) {
            throw new Error('Missing required field: goalID');
        }
        
        const goalBytes = await ctx.stub.getState(goalID);
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found');
        }

        const goal: Goal = JSON.parse(goalBytes.toString());
        return JSON.stringify(goal);
    }
}
