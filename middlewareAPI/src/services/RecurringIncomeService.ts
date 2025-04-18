import RecurrenceRule from '../models/recurrenceModels/RecurrenceRule'
import RecurringIncome from '../models/recurrenceModels/RecurringIncome'
import IncomeService from './IncomeService'
import { Contract } from '@hyperledger/fabric-gateway'
import { TextDecoder } from 'util'
import BasicRecurrenceRule from '../models/recurrenceModels/BasicRecurrenceRule'

const utf8Decoder = new TextDecoder()

class RecurringIncomeService {
    private incomeService: IncomeService
    private contract: Contract

    constructor(incomeService: IncomeService, recurringIncomeContract: Contract) {
        this.incomeService = incomeService
        this.contract = recurringIncomeContract
    }

    public async addRecurringIncome(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule): Promise<boolean> {
        const recurringIncome = new RecurringIncome(userID, title, amount, date, notes, categoryID, recurrenceRule)

        try {
            await this.contract.submitTransaction(
                'createRecurringIncome',
                JSON.stringify(recurringIncome.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async updateRecurringIncome(id: string, userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule): Promise<boolean> {
        try {
            const recurringIncome = await this.findByID(id, userID)
            if (!recurringIncome) {
                throw new Error('The recurring income does not exist')
            }

            recurringIncome.title = title
            recurringIncome.amount = amount
            recurringIncome.date = date
            recurringIncome.notes = notes
            recurringIncome.recurrenceRule = recurrenceRule
            recurringIncome.categoryID = categoryID

            await this.contract.submitTransaction(
                'updateRecurringIncome',
                JSON.stringify(recurringIncome.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async deleteRecurringIncome(id: string, userID: string): Promise<boolean> {
        try {
            await this.contract.submitTransaction(
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

    public async getAllRecurringIncomesByUser(userID: string): Promise<RecurringIncome[]> {
        try {
            const resultBytes = await this.contract.evaluateTransaction(
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

    public async findByID(id: string, userID: string): Promise<RecurringIncome | undefined> {
        try {
            const resultBytes = await this.contract.evaluateTransaction(
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
            const resultBytes = await this.contract.evaluateTransaction(
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
                    await this.incomeService.addIncome(recIncome.getUserID(), recIncome.title, recIncome.amount, new Date(), recIncome.notes, recIncome.categoryID)
                    recIncome.recurrenceRule.computeNextTriggerDate()

                    if (recIncome.recurrenceRule.shouldEnd()) {
                        await this.deleteRecurringIncome(recIncome.getID(), recIncome.getUserID())
                    } else {
                        await this.updateRecurringIncome(recIncome.getID(), recIncome.getUserID(), recIncome.title, recIncome.amount, recIncome.date, recIncome.notes, recIncome.categoryID, recIncome.recurrenceRule)
                    }
                }
            }

        } catch (err) {
            console.log(err)
        }
    }
}

export default RecurringIncomeService
