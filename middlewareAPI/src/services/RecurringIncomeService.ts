import RecurrenceRule from '../models/recurrenceModels/RecurrenceRule'
import RecurringIncome from '../models/recurrenceModels/RecurringIncome'
import IncomeService from './IncomeService'
import { TextDecoder } from 'util'
import BasicRecurrenceRule from '../models/recurrenceModels/BasicRecurrenceRule'
import { GatewayManager } from '../gRPC/init-new'

const utf8Decoder = new TextDecoder()

class RecurringIncomeService {
    private incomeService: IncomeService
    private contractName: string
    private gm: GatewayManager

    constructor(incomeService: IncomeService, gm: GatewayManager) {
        const RECURRING_INCOME_CONTRACT_NAME = process.env.RECURRING_INCOME_CONTRACT_NAME

        if (!RECURRING_INCOME_CONTRACT_NAME) {
            throw new Error("Set env variables first")
        }

        this.incomeService = incomeService
        this.gm = gm
        this.contractName = RECURRING_INCOME_CONTRACT_NAME
    }

    public async addRecurringIncome(email: string, userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule): Promise<boolean> {
        const recurringIncome = new RecurringIncome(userID, title, amount, date, notes, categoryID, recurrenceRule)

        try {
            const contract = await this.gm.getContract(email, this.contractName)
            await contract.submitTransaction(
                'createRecurringIncome',
                JSON.stringify(recurringIncome.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async updateRecurringIncome(email: string, id: string, userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule): Promise<boolean> {
        try {
            const recurringIncome = await this.findByID(email, id, userID)
            if (!recurringIncome) {
                throw new Error('The recurring income does not exist')
            }

            recurringIncome.title = title
            recurringIncome.amount = amount
            recurringIncome.date = date
            recurringIncome.notes = notes
            recurringIncome.recurrenceRule = recurrenceRule
            recurringIncome.categoryID = categoryID

            const contract = await this.gm.getContract(email, this.contractName)
            await contract.submitTransaction(
                'updateRecurringIncome',
                JSON.stringify(recurringIncome.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async deleteRecurringIncome(email: string, id: string, userID: string): Promise<boolean> {
        try {
            const contract = await this.gm.getContract(email, this.contractName)
            await contract.submitTransaction(
                'deleteRecurringIncome',
                userID,
                id
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async getAllRecurringIncomesByUser(email: string, userID: string): Promise<RecurringIncome[]> {
        try {
            const contract = await this.gm.getContract(email, this.contractName)
            const resultBytes = await contract.evaluateTransaction(
                'listRecurringIncomesByUser',
                userID
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const recurringIncomes = result.recurringIncomes.map((i: any) => {
                const recurrenceRule = new BasicRecurrenceRule(i.recurrenceRule.frequency, i.recurrenceRule.interval, new Date(i.recurrenceRule.startDate), new Date(i.recurrenceRule.nextTriggerDate), i.recurrenceRule.endDate ? new Date(i.recurrenceRule.endDate) : undefined)
                return new RecurringIncome(i.userID, i.title, i.amount, new Date(i.date), i.notes, i.categoryID, recurrenceRule, i.id)
            })
            return recurringIncomes
        } catch (err: any) {
            console.log(err)
        }

        return []
    }

    public async findByID(email: string, id: string, userID: string): Promise<RecurringIncome | undefined> {
        try {
            const contract = await this.gm.getContract(email, this.contractName)
            const resultBytes = await contract.evaluateTransaction(
                'getRecurringIncomeByID',
                userID,
                id
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const data = JSON.parse(resultJson)
            const recurrenceRule = new BasicRecurrenceRule(data.recurrenceRule.frequency, data.recurrenceRule.interval, new Date(data.recurrenceRule.startDate), new Date(data.recurrenceRule.nextTriggerDate), data.recurrenceRule.endDate ? new Date(data.recurrenceRule.endDate) : undefined)
            return new RecurringIncome(data.userID, data.title, data.amount, new Date(data.date), data.notes, data.categoryID, recurrenceRule, data.id)
        } catch (err) {
            console.log(err)
        }

        return undefined
    }

    public async processDueRecurringIncomes(): Promise<void> {
        try {
            const ADMIN_ID = process.env.ADMIN_ID
            if (!ADMIN_ID) {
                throw new Error("Set env variables")
            }

            const contract = await this.gm.getContract(ADMIN_ID, this.contractName)
            const resultBytes = await contract.evaluateTransaction(
                'listAllRecurringIncomes'
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const recurringIncomes = result.recurringIncomes.map((i: any) => {
                const recurrenceRule = new BasicRecurrenceRule(i.recurrenceRule.frequency, i.recurrenceRule.interval, new Date(i.recurrenceRule.startDate), new Date(i.recurrenceRule.nextTriggerDate), i.recurrenceRule.endDate ? new Date(i.recurrenceRule.endDate) : undefined)
                return new RecurringIncome(i.userID, i.title, i.amount, new Date(i.date), i.notes, i.categoryID, recurrenceRule, i.id)
            })

            for (const recIncome of recurringIncomes) {
                if (recIncome.recurrenceRule.shouldTrigger()) {
                    await this.incomeService.addIncome(ADMIN_ID, recIncome.getUserID(), recIncome.title, recIncome.amount, new Date(), recIncome.notes, recIncome.categoryID)
                    recIncome.recurrenceRule.computeNextTriggerDate()

                    if (recIncome.recurrenceRule.shouldEnd()) {
                        await this.deleteRecurringIncome(ADMIN_ID, recIncome.getID(), recIncome.getUserID())
                    } else {
                        await this.updateRecurringIncome(ADMIN_ID, recIncome.getID(), recIncome.getUserID(), recIncome.title, recIncome.amount, recIncome.date, recIncome.notes, recIncome.categoryID, recIncome.recurrenceRule)
                    }
                }
            }

        } catch (err) {
            console.log(err)
        }
    }
}

export default RecurringIncomeService
