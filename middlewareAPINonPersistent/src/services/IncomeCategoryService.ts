import IncomeCategory from "../models/core/IncomeCategory"
import User from "../models/core/User"
import IncomeCategoryRepository from "../repositories/IncomeCategoryRepository"

class IncomeCategoryService {
    private repository: IncomeCategoryRepository

    constructor() {
        this.repository = new IncomeCategoryRepository()
    }

    public addIncomeCategory(userID: string, name: string, colour: string): void {
        const category = new IncomeCategory(userID, name, undefined, colour)
        this.repository.add(category)
    }

    public updateIncomeCategory(id: string, name: string, colour: string): void {
        const category = this.repository.findByID(id)
        if (!category) {
            throw new Error(`Income category does not exist`)
        }
        category.name = name
        category.colour = colour
    }

    public deleteIncomeCategory(id: string): void {
        this.repository.delete(id)
    }

    public getAllCategoriesByUser(userID: string): IncomeCategory[] {
        return this.repository.findByUser(userID)
    }

    public getAllCategoriesByUserAndName(user: User, name: string): IncomeCategory[] {
        const all = this.repository.findByUser(user.getUserID())
        return all.filter(cat =>cat.name.toLowerCase() === name.toLowerCase())
    }

    public findByID(id: string): IncomeCategory | undefined {
        return this.repository.findByID(id)
    }
}

export default IncomeCategoryService
