import { Context, Contract, Transaction, Returns, Info } from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

export enum GoalStatus {
    Active = "Active",
    Archived = "Archived"
}

export interface Goal {
    id: string
    userID: string
    title: string
    description: string
    target: number
    targetDate: string
    current: number
    status: GoalStatus
}

@Info({ title: 'GoalContract', description: 'Smart contract for managing goals' })
export class GoalContract extends Contract {
    constructor() {
        super('GoalContract')
    }

    private deterministicStringify(goal: Goal): string {
        return stringify(sortKeysRecursive(goal))
    }

    private getGoalKey(ctx: Context, userID: string, goalID: string): string {
        return ctx.stub.createCompositeKey('Goal', [userID, goalID])
    }

    @Transaction()
    @Returns('string')
    public async createGoal(ctx: Context, goalStr: string): Promise<string> {
        if (!goalStr) {
            throw new Error('Missing goal object')
        }

        let goalInput: any
        try {
            goalInput = JSON.parse(goalStr)
        } catch (error) {
            throw new Error('Goal must be a valid JSON string')
        }

        if (!goalInput.id || !goalInput.userID || !goalInput.title || !goalInput.description || goalInput.target === undefined || !goalInput.targetDate) {
            throw new Error('Missing required fields: id, userID, title, description, target, targetDate')
        }

        const targetNum = Number(goalInput.target)
        if (isNaN(targetNum)) {
            throw new Error('target must be a valid number')
        }

        const newGoal: Goal = {
            id: goalInput.id,
            userID: goalInput.userID,
            title: goalInput.title,
            description: goalInput.description,
            target: targetNum,
            targetDate: goalInput.targetDate,
            current: 0,
            status: goalInput.status ? goalInput.status as GoalStatus : GoalStatus.Active
        }

        const key = this.getGoalKey(ctx, goalInput.userID, goalInput.id)
        const existing = await ctx.stub.getState(key)
        if (existing && existing.length > 0) {
            throw new Error('Goal already exists')
        }

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(newGoal)))
        return JSON.stringify({ message: 'Goal created' })
    }

    @Transaction()
    @Returns('string')
    public async updateGoal(ctx: Context, userID: string, goalID: string, current: string): Promise<string> {
        if (!goalID || current === undefined || !userID) {
            throw new Error('Missing required fields: goalID and current')
        }

        const key = this.getGoalKey(ctx, userID, goalID)
        const goalBytes = await ctx.stub.getState(key)
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found')
        }

        const goal: Goal = JSON.parse(goalBytes.toString())
        const currentNum = Number(current)
        if (isNaN(currentNum)) {
            throw new Error('current must be a valid number')
        }
        
        goal.current = currentNum

        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(goal)))
        return JSON.stringify({ message: 'Goal progress updated' })
    }

    @Transaction()
    @Returns('string')
    public async archiveGoal(ctx: Context, userID: string, goalID: string): Promise<string> {
        if (!goalID || !userID) {
            throw new Error('Missing required field: goalID')
        }

        const key = this.getGoalKey(ctx, userID, goalID)
        const goalBytes = await ctx.stub.getState(key)
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found')
        }

        const goal: Goal = JSON.parse(goalBytes.toString())
        goal.status = GoalStatus.Archived
        
        await ctx.stub.putState(key, Buffer.from(this.deterministicStringify(goal)))
        return JSON.stringify({ message: 'Goal archived' })
    }

    @Transaction()
    @Returns('string')
    public async deleteGoal(ctx: Context, userID: string, goalID: string): Promise<string> {
        if (!goalID) {
            throw new Error('Missing required field: goalID')
        }

        const key = this.getGoalKey(ctx, userID, goalID)
        const goalBytes = await ctx.stub.getState(key)
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found')
        }

        await ctx.stub.deleteState(key)
        return JSON.stringify({ message: 'Goal deleted' })
    }

    @Transaction(false)
    @Returns('string')
    public async listGoalsByUser(ctx: Context, userID: string): Promise<string> {
        if (!userID) {
            throw new Error('Missing required field: userID')
        }
    
        const iterator = ctx.stub.getStateByPartialCompositeKey('Goal', [userID])
        const results: Goal[] = []
    
        for await (const res of iterator) {
            if (res.value) {
                const goal: Goal = JSON.parse(res.value.toString())
                if (goal.userID === userID) {
                    results.push(goal)
                }
            }
        }
    
        return JSON.stringify({ goals: results })
    }
    
    @Transaction(false)
    @Returns('string')
    public async getGoalByID(ctx: Context, userID: string, goalID: string): Promise<string> {
        if (!goalID) {
            throw new Error('Missing required field: goalID')
        }
        
        const key = this.getGoalKey(ctx, userID, goalID)
        const goalBytes = await ctx.stub.getState(key)
        if (!goalBytes || goalBytes.length === 0) {
            throw new Error('Goal not found')
        }

        const goal: Goal = JSON.parse(goalBytes.toString())
        return JSON.stringify(goal)
    }
}
