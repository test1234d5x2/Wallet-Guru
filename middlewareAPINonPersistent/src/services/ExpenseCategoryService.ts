import ExpenseCategory from "../models/core/ExpenseCategory"
import User from "../models/core/User"
import RecurrenceRule from "../models/recurrenceModels/RecurrenceRule"
import ExpenseCategoryRepository from "../repositories/ExpenseCategoryRepository"

class ExpenseCategoryService {
    private repository: ExpenseCategoryRepository

    constructor() {
        this.repository = new ExpenseCategoryRepository()
    }

    public addExpenseCategory(userID: string, name: string, monthlyBudget: number, recurrenceRule: RecurrenceRule, colour: string): void {
        const category = new ExpenseCategory(userID, name, monthlyBudget, recurrenceRule, colour)
        this.repository.add(category)
    }

    public updateExpenseCategory(id: string, name: string, monthlyBudget: number, recurrenceRule: RecurrenceRule, colour: string): void {
        const category = this.repository.findByID(id)
        if (!category) {
            throw new Error(`Category does not exist`)
        }
        category.name = name
        category.monthlyBudget = monthlyBudget
        category.recurrenceRule = recurrenceRule
        category.colour = colour
    }

    public deleteExpenseCategory(id: string): void {
        this.repository.delete(id)
    }

    public getAllCategoriesByUser(userID: string): ExpenseCategory[] {
        return this.repository.findByUser(userID)
    }

    public getAllCategoriesByUserAndName(user: User, name: string): ExpenseCategory[] {
        const allCategories = this.repository.findByUser(user.getUserID())
        return allCategories.filter(category =>
            category.name.toLowerCase() === name.toLowerCase()
        )
    }

    public findByID(id: string): ExpenseCategory | undefined {
        return this.repository.findByID(id)
    }

}

export default ExpenseCategoryService
