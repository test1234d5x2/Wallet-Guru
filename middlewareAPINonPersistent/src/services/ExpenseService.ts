import Expense from "../models/core/Expense"
import ExpenseRepository from "../repositories/ExpenseRepository"

class ExpenseService {
    private repository: ExpenseRepository

    constructor() {
        this.repository = new ExpenseRepository()
    }

    public addExpense(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, receipt?: string): void {
        const expense = new Expense(userID, title, amount, date, notes, categoryID, receipt)
        this.repository.add(expense)
    }

    public updateExpense(id: string, title: string, amount: number, date: Date, notes: string, categoryID: string, receipt?: string): void {
        const expense = this.repository.findById(id)
        if (!expense) {
            throw new Error(`The expense does not exist`)
        }
        expense.title = title
        expense.amount = amount
        expense.date = date
        expense.notes = notes
        expense.categoryID = categoryID
        expense.receipt = receipt || undefined
    }

    public deleteExpense(id: string): void {
        this.repository.delete(id)
    }

    public getAllExpensesByUser(userID: string): Expense[] {
        return this.repository.findByUser(userID)
    }

    public findByID(id: string): Expense | undefined {
        return this.repository.findById(id)
    }
}

export default ExpenseService
