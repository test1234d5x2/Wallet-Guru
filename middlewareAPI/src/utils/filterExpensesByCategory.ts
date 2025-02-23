import Expense from "../models/core/Expense";
import ExpenseCategory from "../models/core/ExpenseCategory";

export default function filterExpensesByCategory(expenses: Expense[], category: ExpenseCategory): Expense[] {
    return expenses.filter(expense => expense.categoryID === category.getID());
}
