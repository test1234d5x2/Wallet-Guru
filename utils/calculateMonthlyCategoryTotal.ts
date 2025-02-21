import Expense from "@/models/Expense";
import ExpenseCategory from "@/models/ExpenseCategory";
import filterTransactionByMonth from "./filterTransactionByMonth";


function calculateMonthlyCategoryTotal(expenses: Expense[], month: Date, category: ExpenseCategory): number {
    const expensesByMonth = getFilteredExpenses(expenses, month, category);
    return reduceExpensesToTotal(expensesByMonth);
}

function getFilteredExpenses(expenses: Expense[], month: Date, category: ExpenseCategory): Expense[] {
    expenses = filterTransactionByMonth(expenses, month) as Expense[];
    return expenses.filter(exp => exp.expenseCategory.getID() === category.getID());
}

function reduceExpensesToTotal(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export default calculateMonthlyCategoryTotal;