import RecurringIncomeRepository from "../repositories/RecurringIncomeRepository"
import RecurrenceRule from "../models/recurrenceModels/RecurrenceRule"
import RecurringIncome from "../models/recurrenceModels/RecurringIncome"
import IncomeService from "./IncomeService"

class RecurringIncomeService {
    private repository: RecurringIncomeRepository
    private incomeService: IncomeService

    constructor(incomeService: IncomeService) {
        this.repository = new RecurringIncomeRepository()
        this.incomeService = incomeService
    }

    public addRecurringIncome(userID: string, title: string, amount: number, date: Date, notes: string, recurrenceRule: RecurrenceRule): void {
        const recurringIncome = new RecurringIncome(userID, title, amount, date, notes, recurrenceRule)
        this.repository.add(recurringIncome)
    }

    public updateRecurringIncome(
        id: string,
        title: string,
        amount: number,
        date: Date,
        notes: string
    ): void {
        const recurringIncome = this.repository.findById(id)
        if (!recurringIncome) {
            throw new Error("The recurring income does not exist")
        }
        recurringIncome.title = title
        recurringIncome.amount = amount
        recurringIncome.date = date
        recurringIncome.notes = notes
    }

    public deleteRecurringIncome(id: string): void {
        this.repository.delete(id)
    }

    public getAllRecurringIncomesByUser(userID: string): RecurringIncome[] {
        return this.repository.findByUser(userID)
    }

    public findByID(id: string): RecurringIncome | undefined {
        return this.repository.findById(id)
    }

    public processDueRecurringIncomes(): void {
        const recurringIncomes = this.repository.getAll()
        recurringIncomes.forEach(recIncome => {
            if (recIncome.recurrenceRule.shouldTrigger()) {
                this.incomeService.addIncome(recIncome.getUserID(), recIncome.title, recIncome.amount, new Date(), recIncome.notes)
                recIncome.recurrenceRule.computeNextTriggerDate()
            }
        })
    }
}

export default RecurringIncomeService
