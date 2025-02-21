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

    public calculateMonthlyTransactionsTotal(user: User, month: Date): number {
        const monthlyTransactions = this.getFilteredExpenses(user, month);
        return this.reduceExpensesToTotal(monthlyTransactions);
    }

    public getMonthlyExpenseTrends(user: User, months: Date[]): number[] {
        return months.map(month => {return this.calculateMonthlyTransactionsTotal(user, month)});
    }

    public calculateMonthlyCategoryTotal(user: User, month: Date, category: ExpenseCategory): number {
        const monthlyTransactions = this.getFilteredExpenses(user, month);
        return this.reduceExpensesToTotal(
            monthlyTransactions.filter(exp => exp.expenseCategory.getID() === category.getID())
        );
    }

    public getTotalExpensesByCategory(user: User, month: Date): Record<string, number> {
        const monthlyExpenses = this.getFilteredExpenses(user, month);
        const categoryTotals: Record<string, number> = {};

        monthlyExpenses.forEach(expense => {
            const category = expense.expenseCategory.name;
            categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
        });

        return categoryTotals;
    }

    public findByID(id: string): Expense | undefined {
        return this.repository.findById(id);
    }

    private getFilteredExpenses(user: User, month: Date): Expense[] {
        const transactions = this.getAllExpensesByUser(user);
        return filterTransactionByMonth(transactions, month) as Expense[];
    }

    private reduceExpensesToTotal(expenses: Expense[]): number {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }


}

export default ExpenseService;
