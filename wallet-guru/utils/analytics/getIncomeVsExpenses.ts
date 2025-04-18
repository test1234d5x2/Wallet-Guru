import Expense from "@/models/core/Expense"
import Income from "@/models/core/Income"
import IncomeExpenseSet from "@/models/analytics/IncomeExpenseSet"
import getStartOfMonth from "../getStartOfMonth"
import getEndOfMonth from "../getEndOfMonth"
import calculateTransactionsTotalForTimeWindow from "../calculateTransactionsTotalForTimeWindow"


export default function getIncomeVsExpenses(expenses: Expense[], incomes: Income[], months: Date[]): IncomeExpenseSet {
    const incomeTotals = months.map((month) => {return calculateTransactionsTotalForTimeWindow(incomes, getStartOfMonth(month), getEndOfMonth(month))})
    const expenseTotals = months.map((month) => {return calculateTransactionsTotalForTimeWindow(expenses, getStartOfMonth(month), getEndOfMonth(month))})
    const comparisonSet: IncomeExpenseSet = {incomeTotals, expenseTotals}
    return comparisonSet
}