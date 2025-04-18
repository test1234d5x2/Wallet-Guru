import Expense from "@/models/core/Expense"
import ExpenseCategory from "@/models/core/ExpenseCategory"
import NameTotalSet from "@/models/analytics/NameTotalSet"
import filterExpensesByCategory from "../filterExpensesByCategory"
import calculateTransactionsTotalForTimeWindow from "../calculateTransactionsTotalForTimeWindow"

export default function getCategoryDistribution(expenses: Expense[], categories: ExpenseCategory[], startDate: Date, endDate: Date): NameTotalSet[] {
    return categories.map((category) => {
        return {
            name: category.name,
            total: calculateTransactionsTotalForTimeWindow(filterExpensesByCategory(expenses, category), startDate, endDate)
        }
    })
}