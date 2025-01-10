import User from "../User";
import ExpenseCategory from "../ExpenseCategory";
import filterTransactionByMonth from "@/utils/filterTransactionByMonth";
import Expense from "../Expense";
import ExpenseRepository from "./ExpenseRepository";

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

        this.repository.update(id, expense);
    }

    public deleteExpense(id: string): void {
        this.repository.delete(id);
    }

    public getAllExpensesByUser(user: User): Expense[] {
        return this.repository.findByUser(user.getUserID());
    }

    public calculateMonthlyTransactionsTotal(user: User, month: Date): number {
        const transactions = this.repository.findByUser(user.getUserID());
        const monthlyTransactions = filterTransactionByMonth(transactions, month);

        return monthlyTransactions.reduce((sum, expense) => sum + expense.amount, 0);
    }

    public calculateMonthlyCategoryTotal(user: User, month: Date, category: ExpenseCategory): number {
        const transactions = this.repository.findByUser(user.getUserID());
        const monthlyTransactions = filterTransactionByMonth(transactions, month) as Expense[];

        return monthlyTransactions
            .filter(exp => exp.expenseCategory.getID() === category.getID())
            .reduce((sum, expense) => sum + expense.amount, 0);
    }
}

export default ExpenseService;
