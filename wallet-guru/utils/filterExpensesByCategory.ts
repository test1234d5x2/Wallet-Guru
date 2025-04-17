import Expense from "@/models/core/Expense"
import ExpenseCategory from "@/models/core/ExpenseCategory"

export default function filterExpensesByCategory<T extends Expense>(expenses: T[], category: ExpenseCategory): T[] {
    return expenses.filter(expense => expense.categoryID === category.getID())
}
