import RecurringExpense from "../models/recurrenceModels/RecurringExpense";

class RecurringExpenseRepository {
    private recurringExpenses: RecurringExpense[] = [];

    public add(expense: RecurringExpense): void {
        const exists = this.recurringExpenses.some(exp => exp.getID() === expense.getID());
        if (exists) {
            throw new Error(`Recurring Expense already exists`);
        }
        this.recurringExpenses.push(expense);
    }

    public delete(id: string): void {
        const index = this.recurringExpenses.findIndex(exp => exp.getID() === id);
        if (index === -1) {
            throw new Error(`Recurring Expense not found`);
        }
        this.recurringExpenses.splice(index, 1);
    }

    public findByUser(userID: string): RecurringExpense[] {
        return this.recurringExpenses.filter(exp => exp.getUserID() === userID);
    }

    public findById(id: string): RecurringExpense | undefined {
        return this.recurringExpenses.find(exp => exp.getID() === id);
    }

    // Return all recurring expenses (used for batch processing)
    public getAll(): RecurringExpense[] {
        return this.recurringExpenses;
    }
}

export default RecurringExpenseRepository;