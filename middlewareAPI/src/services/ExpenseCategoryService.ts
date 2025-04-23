import ExpenseCategory from '../models/core/ExpenseCategory'
import RecurrenceRule from '../models/recurrenceModels/RecurrenceRule'
import { TextDecoder } from 'util'
import BasicRecurrenceRule from '../models/recurrenceModels/BasicRecurrenceRule'
import { GatewayManager } from '../gRPC/init'

const utf8Decoder = new TextDecoder()

class ExpenseCategoryService {
    private expenseCategoryContractName: string
    private gm: GatewayManager

    constructor(gm: GatewayManager) {
        const EXPENSE_CATEGORY_CONTRACT_NAME = process.env.EXPENSE_CATEGORY_CONTRACT_NAME
        if (!EXPENSE_CATEGORY_CONTRACT_NAME) {
            throw new Error("Set env variables")
        }

        this.gm = gm
        this.expenseCategoryContractName = EXPENSE_CATEGORY_CONTRACT_NAME
    }

    public async addExpenseCategory(email: string, userID: string, name: string, monthlyBudget: number, recurrenceRule: RecurrenceRule, colour: string): Promise<boolean> {
        const category = new ExpenseCategory(userID, name, monthlyBudget, recurrenceRule, undefined, colour)
        try {
            const expenseCategoryContract = await this.gm.getContract(email, this.expenseCategoryContractName)
            await expenseCategoryContract.submitTransaction(
                'createExpenseCategory',
                JSON.stringify(category.toJSON())
            )

            return true
        } catch (err) {
            console.log(err)
        }

        return false
    }

    public async updateExpenseCategory(email: string, id: string, userID: string, name: string, monthlyBudget: number, recurrenceRule: BasicRecurrenceRule, colour: string): Promise<boolean> {
        try {
            const category = await this.findByID(email, id, userID)
            if (!category) {
                throw new Error('Category not found')
            }

            category.name = name
            category.monthlyBudget = monthlyBudget
            category.recurrenceRule = recurrenceRule
            category.colour = colour

            const expenseCategoryContract = await this.gm.getContract(email, this.expenseCategoryContractName)
            await expenseCategoryContract.submitTransaction(
                'updateExpenseCategory',
                JSON.stringify(category.toJSON())
            )

            return true
        } catch (err) {
            console.log(err)
        }

        return false
    }

    public async deleteExpenseCategory(email: string, id: string, userID: string): Promise<boolean> {
        try {
            const expenseCategoryContract = await this.gm.getContract(email, this.expenseCategoryContractName)
            await expenseCategoryContract.submitTransaction(
                'deleteExpenseCategory',
                userID,
                id
            )

            return true
        } catch (err) {
            console.log(err)
        }

        return false
    }

    public async getAllCategoriesByUser(email: string, userID: string): Promise<ExpenseCategory[]> {
        try {
            const expenseCategoryContract = await this.gm.getContract(email, this.expenseCategoryContractName)
            const resultBytes = await expenseCategoryContract.evaluateTransaction(
                'listExpenseCategoriesByUser',
                userID
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const categories: ExpenseCategory[] = result.categories.map((category: any) => {
                const recurrenceRule = new BasicRecurrenceRule(
                    category.recurrenceRule.frequency,
                    category.recurrenceRule.interval,
                    new Date(category.recurrenceRule.startDate),
                    category.recurrenceRule.nextTriggerDate ? new Date(category.recurrenceRule.nextTriggerDate) : undefined,
                    category.recurrenceRule.endDate ? new Date(category.recurrenceRule.endDate) : undefined
                )
                return new ExpenseCategory(category.userID, category.name, category.monthlyBudget, recurrenceRule, category.id, category.colour)
            })
            return categories
        } catch (err) {
            console.log(err)
        }

        return []
    }

    public async findByID(email: string, id: string, userID: string): Promise<ExpenseCategory | undefined> {
        try {
            const expenseCategoryContract = await this.gm.getContract(email, this.expenseCategoryContractName)
            const resultBytes = await expenseCategoryContract.evaluateTransaction(
                'getExpenseCategoryByID',
                userID,
                id
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const data = JSON.parse(resultJson)
            const recurrenceRule = new BasicRecurrenceRule(
                data.recurrenceRule.frequency,
                data.recurrenceRule.interval,
                new Date(data.recurrenceRule.startDate),
                data.recurrenceRule.nextTriggerDate ? new Date(data.recurrenceRule.nextTriggerDate) : undefined,
                data.recurrenceRule.endDate ? new Date(data.recurrenceRule.endDate) : undefined
            )
            return new ExpenseCategory(data.userID, data.name, data.monthlyBudget, recurrenceRule, data.id, data.colour)
        } catch (err) {
            console.log(err)
        }

        return undefined
    }
}

export default ExpenseCategoryService
