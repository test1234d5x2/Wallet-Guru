import Expense from "../Expense";

class ExpenseRepository {
    private expenses: Expense[] = [];

    public add(expense: Expense): void {
        const exists = this.expenses.some(exp => exp.getID() === expense.getID());
        if (exists) {
            throw new Error(`Expense already exists`);
        }
        this.expenses.push(expense);
    }

    public update(id: string, updatedExpense: Expense): void {
        const index = this.expenses.findIndex(exp => exp.getID() === id);
        if (index === -1) {
            throw new Error(`Expense not found`);
        }
        this.expenses[index] = updatedExpense;
    }

    public delete(id: string): void {
        const index = this.expenses.findIndex(exp => exp.getID() === id);
        if (index === -1) {
            throw new Error(`Expense not found`);
        }
        this.expenses.splice(index, 1);
    }

    public findByUser(userID: string): Expense[] {
        return this.expenses.filter(exp => exp.getUser().getUserID() === userID);
    }

    public findById(id: string): Expense | undefined {
        return this.expenses.find(exp => exp.getID() === id);
    }
}

export default ExpenseRepository;
