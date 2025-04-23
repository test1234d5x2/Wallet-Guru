import GoalStatus from '../enums/GoalStatus'
import { GatewayManager } from '../gRPC/init'
import Goal from '../models/core/Goal'
import { TextDecoder } from 'util'

const utf8Decoder = new TextDecoder()

class GoalService {
    private gm: GatewayManager
    private goalContractName: string

    constructor(gm: GatewayManager) {
        const GOAL_CONTRACT_NAME = process.env.GOAL_CONTRACT_NAME
        if (!GOAL_CONTRACT_NAME) {
            throw new Error("Set env variables.")
        }

        this.gm = gm
        this.goalContractName = GOAL_CONTRACT_NAME
    }

    public async addGoal(email: string, userID: string, title: string, description: string, target: number, targetDate: Date, status: GoalStatus): Promise<boolean> {
        const goal = new Goal(title, userID, description, target, targetDate, status)

        try {
            const goalContract = await this.gm.getContract(email, this.goalContractName)
            await goalContract.submitTransaction(
                'createGoal',
                JSON.stringify(goal.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async updateGoalProgress(email: string, id: string, userID: string, current: number): Promise<boolean> {
        try {
            const goal = await this.findByID(email, id, userID)
            if (!goal) {
                throw new Error('Goal does not exist')
            }
            goal.updateCurrent(current)

            const goalContract = await this.gm.getContract(email, this.goalContractName)
            await goalContract.submitTransaction(
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

    public async deleteGoal(email: string, id: string, userID: string): Promise<boolean> {
        try {
            const goalContract = await this.gm.getContract(email, this.goalContractName)
            await goalContract.submitTransaction(
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

    public async getAllGoalsByUser(email: string, userID: string): Promise<Goal[]> {
        try {
            const goalContract = await this.gm.getContract(email, this.goalContractName)
            const resultBytes = await goalContract.evaluateTransaction(
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

    public async findByID(email: string, id: string, userID: string): Promise<Goal | undefined> {
        try {
            const goalContract = await this.gm.getContract(email, this.goalContractName)
            const resultBytes = await goalContract.evaluateTransaction(
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
