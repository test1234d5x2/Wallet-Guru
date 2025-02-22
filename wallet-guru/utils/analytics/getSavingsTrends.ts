import Expense from "@/models/Expense";
import Income from "@/models/Income";
import getIncomeVsExpenses from "./getIncomeVsExpenses";

export default function getSavingsTrends(expenses: Expense[], incomes: Income[], months: Date[]): number[] {
    const comparisonSet = getIncomeVsExpenses(expenses, incomes, months);
    return comparisonSet.map((comp) => comp.incomeTotal - comp.expenseTotal);
}