import ExpenseCategory from "../ExpenseCategory";
import ExpenseCategoryRepository from "./ExpenseCategoryRepository";
import User from "../User";

class ExpenseCategoryService {
    private repository: ExpenseCategoryRepository;

    constructor() {
        this.repository = new ExpenseCategoryRepository();
    }

    public addExpenseCategory(user: User, name: string, monthlyBudget: number): void {
        const category = new ExpenseCategory(user, name, monthlyBudget);
        this.repository.add(category);
    }

    public updateExpenseCategory(id: string, name: string, monthlyBudget: number): void {
        const category = this.repository.findByID(id);
        if (!category) {
            throw new Error(`Category does not exist`);
        }
        category.name = name;
        category.monthlyBudget = monthlyBudget;

        this.repository.update(id, category);
    }

    public deleteExpenseCategory(id: string): void {
        this.repository.delete(id);
    }

    public getAllCategoriesByUser(user: User): ExpenseCategory[] {
        return this.repository.findByUser(user.getUserID());
    }
}

export default ExpenseCategoryService;
