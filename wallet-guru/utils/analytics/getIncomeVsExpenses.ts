import Expense from "@/models/core/Expense";
import Income from "@/models/core/Income";
import IncomeExpenseSet from "@/models/analytics/IncomeExpenseSet";
import calculateMonthlyTransactionsTotal from "../calculateMonthlyTransactionsTotal";

export default function getIncomeVsExpenses(expenses: Expense[], incomes: Income[], months: Date[]): IncomeExpenseSet {
    const incomeTotals = months.map((month) => {return calculateMonthlyTransactionsTotal(incomes, month)});
    const expenseTotals = months.map((month) => {return calculateMonthlyTransactionsTotal(expenses, month)});
    const comparisonSet: IncomeExpenseSet = {incomeTotals, expenseTotals}
    return comparisonSet;
}