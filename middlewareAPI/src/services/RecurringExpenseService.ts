import RecurringExpense from '../models/recurrenceModels/RecurringExpense'
import RecurrenceRule from '../models/recurrenceModels/RecurrenceRule'
import ExpenseService from './ExpenseService'
import { Contract } from '@hyperledger/fabric-gateway'
import { TextDecoder } from 'util'
import BasicRecurrenceRule from '../models/recurrenceModels/BasicRecurrenceRule'

const utf8Decoder = new TextDecoder()

class RecurringExpenseService {
    private expenseService: ExpenseService
    private contract: Contract

    constructor(expenseService: ExpenseService, recurringExpenseContract: Contract) {
        this.expenseService = expenseService
        this.contract = recurringExpenseContract
    }

    public async addRecurringExpense(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule): Promise<boolean> {
        const recurringExpense = new RecurringExpense(userID, title, amount, date, notes, categoryID, recurrenceRule)

        try {
            await this.contract.submitTransaction(
                'createRecurringExpense',
                JSON.stringify(recurringExpense.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async updateRecurringExpense(id: string, userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule): Promise<boolean> {
        try {
            const recurringExpense = await this.findByID(id, userID)
            if (!recurringExpense) {
                throw new Error('The recurring expense does not exist')
            }
            recurringExpense.title = title
            recurringExpense.amount = amount
            recurringExpense.date = date
            recurringExpense.notes = notes
            recurringExpense.categoryID = categoryID
            recurringExpense.recurrenceRule = recurrenceRule

            await this.contract.submitTransaction(
                'updateRecurringExpense',
                JSON.stringify(recurringExpense.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async deleteRecurringExpense(id: string, userID: string): Promise<boolean> {
        try {
            await this.contract.submitTransaction(
                'deleteRecurringExpense',
                userID,
                id
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async getAllRecurringExpensesByUser(userID: string): Promise<RecurringExpense[]> {
        try {
            const resultBytes = await this.contract.evaluateTransaction(
                'listRecurringExpensesByUser',
                userID
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const recurringExpenses = result.recurringExpenses.map((e: any) => {
                const recurrenceRule = new BasicRecurrenceRule(e.recurrenceRule.frequency, e.recurrenceRule.interval, new Date(e.recurrenceRule.startDate), new Date(e.recurrenceRule.nextTriggerDate), e.recurrenceRule.endDate ? new Date(e.recurrenceRule.endDate) : undefined)
                return new RecurringExpense(e.userID, e.title, e.amount, new Date(e.date), e.notes, e.categoryID, recurrenceRule, e.id)
            })
            return recurringExpenses
        } catch (err) {
            console.log(err)
        }

        return []
    }

    public async findByID(id: string, userID: string): Promise<RecurringExpense | undefined> {
        try {
            const resultBytes = await this.contract.evaluateTransaction(
                'getRecurringExpenseByID',
                userID,
                id
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const data = JSON.parse(resultJson)
            const recurrenceRule = new BasicRecurrenceRule(data.recurrenceRule.frequency, data.recurrenceRule.interval, new Date(data.recurrenceRule.startDate), new Date(data.recurrenceRule.nextTriggerDate), data.recurrenceRule.endDate ? new Date(data.recurrenceRule.endDate) : undefined)
            return new RecurringExpense(data.userID, data.title, data.amount, new Date(data.date), data.notes, data.categoryID, recurrenceRule, data.id)
        } catch (err) {
            console.log(err)
        }

        return undefined
    }

    public async processDueRecurringExpenses(): Promise<void> {
        try {
            const resultBytes = await this.contract.evaluateTransaction(
                'listAllRecurringExpenses'
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const recurringExpenses = result.recurringExpenses.map((e: any) => {
                const recurrenceRule = new BasicRecurrenceRule(e.recurrenceRule.frequency, e.recurrenceRule.interval, new Date(e.recurrenceRule.startDate), new Date(e.recurrenceRule.nextTriggerDate), new Date(e.recurrenceRule.endDate))
                return new RecurringExpense(e.userID, e.title, e.amount, new Date(e.date), e.notes, e.categoryID, recurrenceRule, e.id)
            })

            for (const recExp of recurringExpenses) {
                if (recExp.recurrenceRule.shouldTrigger()) {
                    await this.expenseService.addExpense(recExp.getUserID(), recExp.title, recExp.amount, new Date(), recExp.notes, recExp.categoryID, recExp.receipt)
                    recExp.recurrenceRule.computeNextTriggerDate()

                    if (recExp.recurrenceRule.shouldEnd()) {
                        await this.deleteRecurringExpense(recExp.getID(), recExp.getUserID())
                    } else {
                        await this.updateRecurringExpense(recExp.getID(), recExp.getUserID(), recExp.title, recExp.amount, recExp.date, recExp.notes, recExp.categoryID, recExp.recurrenceRule)
                    }
                }
            }

        } catch (err) {
            console.log(err)
        }
    }
}

export default RecurringExpenseService
