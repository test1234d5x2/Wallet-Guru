import User from "../models/User";
import ExpenseCategory from "../models/ExpenseCategory";
import filterTransactionByMonth from "../utils/filterTransactionByMonth";
import Expense from "../models/Expense";
import ExpenseRepository from "../repositories/ExpenseRepository";

class ExpenseService {
    private repository: ExpenseRepository;

    constructor() {
        this.repository = new ExpenseRepository();
    }

    public addExpense(user: User, title: string, amount: number, date: Date, notes: string, category: ExpenseCategory, receipt?: string): void {
        const expense = new Expense(user, title, amount, date, notes, category, receipt);
        this.repository.add(expense);
    }

    public updateExpense(id: string, title: string, amount: number, date: Date, notes: string, category: ExpenseCategory, receipt?: string): void {
        const expense = this.repository.findById(id);
        if (!expense) {
            throw new Error(`The expense does not exist`);
        }
        expense.title = title;
        expense.amount = amount;
        expense.date = date;
        expense.notes = notes;
        expense.expenseCategory = category;
        expense.receipt = receipt || undefined;
    }

    public deleteExpense(id: string): void {
        this.repository.delete(id);
    }

    public getAllExpensesByUser(user: User): Expense[] {
        return this.repository.findByUser(user.getUserID());
    }


    public findByID(id: string): Expense | undefined {
        return this.repository.findById(id);
    }


}

export default ExpenseService;
