import Expense from "@/models/core/Expense";
import ExpenseCategory from "@/models/core/ExpenseCategory";
import filterExpensesByCategory from "./filterExpensesByCategory";
import filterTransactionsByTimeWindow from "./filterTransactionsByTimeWindow";


function calculateCategoryTotalForCurrentWindow(expenses: Expense[], category: ExpenseCategory): number {
    const expensesByMonth = getFilteredExpenses(expenses, category);
    return reduceExpensesToTotal(expensesByMonth);
}

function getFilteredExpenses(expenses: Expense[], category: ExpenseCategory): Expense[] {
    return filterExpensesByCategory(filterTransactionsByTimeWindow(expenses, category.recurrenceRule.startDate, category.recurrenceRule.nextTriggerDate) as Expense[], category);
}

function reduceExpensesToTotal(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export default calculateCategoryTotalForCurrentWindow;