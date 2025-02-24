import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';


@Info({ title: 'GoalContract', description: 'Smart contract for managing goals' })
export class GoalContract extends Contract {
    private readonly objectType = 'Goal';

    @Transaction()
    public async CreateGoal(ctx: Context, id: string, userID: string, title: string, description: string, target: number, status: string): Promise<void> {
        const goalKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const exists = await this.GoalExists(ctx, id);
        if (exists) {
            throw new Error(`The goal with ID ${id} already exists`);
        }

        const goal = {
            ID: id,
            UserID: userID,
            Title: title,
            Description: description,
            Target: target,
            Current: 0,
            Status: status
        };

        await ctx.stub.putState(goalKey, Buffer.from(stringify(sortKeysRecursive(goal))));
    }

    @Transaction(false)
    @Returns('boolean')
    public async GoalExists(ctx: Context, id: string): Promise<boolean> {
        const goalKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const goalJSON = await ctx.stub.getState(goalKey);
        return goalJSON && goalJSON.length > 0;
    }

    @Transaction()
    public async UpdateGoal(ctx: Context, id: string, userID: string, title: string, description: string, target: number, current: number, status: string): Promise<void> {
        const goalKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const exists = await this.GoalExists(ctx, id);
        if (!exists) {
            throw new Error(`The goal with ID ${id} does not exist`);
        }

        const updatedGoal = {
            ID: id,
            UserID: userID,
            Title: title,
            Description: description,
            Target: target,
            Current: current,
            Status: status
        };

        await ctx.stub.putState(goalKey, Buffer.from(stringify(sortKeysRecursive(updatedGoal))));
    }

    @Transaction()
    public async DeleteGoal(ctx: Context, id: string): Promise<void> {
        const goalKey = ctx.stub.createCompositeKey(this.objectType, [id]);
        const exists = await this.GoalExists(ctx, id);
        if (!exists) {
            throw new Error(`The goal with ID ${id} does not exist`);
        }
        await ctx.stub.deleteState(goalKey);
    }

    @Transaction(false)
    @Returns('Goal[]')
    public async GetAllGoalsByUser(ctx: Context, userID: string): Promise<any[]> {
        const allGoals = [];

        const iterator = await ctx.stub.getStateByPartialCompositeKey(this.objectType, []);
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value).toString('utf8');
            try {
                const goal = JSON.parse(strValue);
                if (goal.UserID === userID) {
                    allGoals.push(goal);
                }
            } catch (error) {
                console.error(`Error parsing goal: ${error}`);
            }
            result = await iterator.next();
        }
        await iterator.close();
        return allGoals;
    }
}