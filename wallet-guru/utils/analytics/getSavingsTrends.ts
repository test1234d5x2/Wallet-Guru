import Expense from "@/models/Expense";
import Income from "@/models/Income";
import getIncomeVsExpenses from "./getIncomeVsExpenses";

export default function getSavingsTrends(expenses: Expense[], incomes: Income[], months: Date[]): number[] {
    const {incomeTotals, expenseTotals} = getIncomeVsExpenses(expenses, incomes, months);
    return incomeTotals.map((i, index) => incomeTotals[index] - expenseTotals[index])
}