import Expense from "@/models/Expense";
import ExpenseCategory from "@/models/ExpenseCategory";
import NameTotalSet from "@/models/analytics/NameTotalSet";
import calculateMonthlyCategoryTotal from "../calculateMonthlyCategoryTotal";

export default function getCategoryDistribution(expenses: Expense[], month: Date, categories: ExpenseCategory[]): NameTotalSet[] {
    return categories.map((category) => {
        return {
            name: category.name,
            total: calculateMonthlyCategoryTotal(expenses, month, category)
        }
    });
}