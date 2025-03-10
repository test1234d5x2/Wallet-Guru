import GoalStatus from '../enums/GoalStatus'
import Goal from '../models/core/Goal'
import { Contract } from '@hyperledger/fabric-gateway'
import { TextDecoder } from 'util'

const utf8Decoder = new TextDecoder()

class GoalService {
    private goalContract: Contract

    constructor(c: Contract) {
        this.goalContract = c
    }

    public async addGoal(userID: string, title: string, description: string, target: number, targetDate: Date, status: GoalStatus): Promise<boolean> {
        const goal = new Goal(title, userID, description, target, targetDate, status)

        try {
            await this.goalContract.submitTransaction(
                'createGoal',
                JSON.stringify(goal.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async updateGoalProgress(id: string, userID: string, current: number): Promise<boolean> {
        try {
            const goal = await this.findByID(id, userID)
            if (!goal) {
                throw new Error('Goal does not exist')
            }
            goal.updateCurrent(current)

            await this.goalContract.submitTransaction(
                'updateGoal',
                userID,
                id,
                goal.current.toString()
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async deleteGoal(id: string, userID: string): Promise<boolean> {
        try {
            await this.goalContract.submitTransaction(
                'deleteGoal',
                userID,
                id
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async getAllGoalsByUser(userID: string): Promise<Goal[]> {
        try {
            const resultBytes = await this.goalContract.evaluateTransaction(
                'listGoalsByUser',
                userID
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const goals: Goal[] = result.goals.map((goal: any) => new Goal(goal.title, goal.userID, goal.description, goal.target, new Date(goal.targetDate), goal.status, goal.id, goal.current))
            return goals
        } catch {
            console.log('Failed To Get Goals')
        }

        return []
    }

    public async findByID(id: string, userID: string): Promise<Goal | undefined> {
        try {
            const resultBytes = await this.goalContract.evaluateTransaction(
                'getGoalByID',
                userID,
                id
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const data = JSON.parse(resultJson)
            return new Goal(data.title, data.userID, data.description, data.target, new Date(data.targetDate), data.status, data.id, data.current)
        } catch (err) {
            console.log(err)
        }

        return undefined
    }
}

export default GoalService
