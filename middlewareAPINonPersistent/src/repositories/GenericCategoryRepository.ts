import Category from '../models/core/Category'

export default class GenericCategoryRepository<T extends Category> {
    private categories: T[] = []

    public add(category: T): void {
        const exists = this.categories.some(cat => cat.getID() === category.getID())
        if (exists) {
            throw new Error('Category already exists')
        }
        this.categories.push(category)
    }

    public delete(id: string): void {
        const index = this.categories.findIndex(cat => cat.getID() === id)
        if (index === -1) {
            throw new Error('Category not found')
        }
        this.categories.splice(index, 1)
    }

    public findByUser(userID: string): T[] {
        return this.categories.filter(cat => cat.getUserID() === userID)
    }

    public findByID(id: string): T | undefined {
        return this.categories.find(cat => cat.getID() === id)
    }
}
