import Expense from "@/models/core/Expense";
import ExpenseCategory from "@/models/core/ExpenseCategory";
import filterTransactionByMonth from "./filterTransactionByMonth";
import filterExpensesByCategory from "./filterExpensesByCategory";


function calculateMonthlyCategoryTotal(expenses: Expense[], month: Date, category: ExpenseCategory): number {
    const expensesByMonth = getFilteredExpenses(expenses, month, category);
    return reduceExpensesToTotal(expensesByMonth);
}

function getFilteredExpenses(expenses: Expense[], month: Date, category: ExpenseCategory): Expense[] {
    return filterExpensesByCategory(filterTransactionByMonth(expenses, month) as Expense[], category);
}

function reduceExpensesToTotal(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export default calculateMonthlyCategoryTotal;