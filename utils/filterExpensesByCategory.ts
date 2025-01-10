import Expense from "@/models/Expense";
import ExpenseCategory from "@/models/ExpenseCategory";

export default function filterExpensesByCategory(expenses: Expense[], category: ExpenseCategory): Expense[] {
    return expenses.filter(expense => expense.expenseCategory.getID() === category.getID());
}
