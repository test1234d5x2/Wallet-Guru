import ExpenseCategory from "../models/ExpenseCategory";

class ExpenseCategoryRepository {
    private categories: ExpenseCategory[] = [];

    public add(category: ExpenseCategory): void {
        const exists = this.categories.some(cat => cat.getID() === category.getID());
        if (exists) {
            throw new Error(`Category already exists`);
        }
        this.categories.push(category);
    }

    public delete(id: string): void {
        const index = this.categories.findIndex(cat => cat.getID() === id);
        if (index === -1) {
            throw new Error(`Category not found`);
        }
        this.categories.splice(index, 1);
    }

    public findByUser(userID: string): ExpenseCategory[] {
        return this.categories.filter(cat => cat.getUser().getUserID() === userID);
    }

    public findByID(id: string): ExpenseCategory {
        let category = this.categories.filter(cat => cat.getID() === id);

        if (category.length === 0) {
            throw new Error(`Category not found`);
        }

        return category[0];
    }
}

export default ExpenseCategoryRepository;
