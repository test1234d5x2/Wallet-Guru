import ExpenseCategory from "../models/core/ExpenseCategory"

class ExpenseCategoryRepository {
    private categories: ExpenseCategory[] = []

    public add(category: ExpenseCategory): void {
        const exists = this.categories.some(cat => cat.getID() === category.getID())
        if (exists) {
            throw new Error(`Category already exists`)
        }
        this.categories.push(category)
    }

    public delete(id: string): void {
        const index = this.categories.findIndex(cat => cat.getID() === id)
        if (index === -1) {
            throw new Error(`Category not found`)
        }
        this.categories.splice(index, 1)
    }

    public findByUser(userID: string): ExpenseCategory[] {
        return this.categories.filter(cat => cat.getUserID() === userID)
    }

    public findByID(id: string): ExpenseCategory | undefined {
        return this.categories.find(cat => cat.getID() === id)
    }
}

export default ExpenseCategoryRepository
