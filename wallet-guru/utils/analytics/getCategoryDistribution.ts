import Expense from "@/models/core/Expense";
import ExpenseCategory from "@/models/core/ExpenseCategory";
import NameTotalSet from "@/models/analytics/NameTotalSet";
import calculateMonthlyCategoryTotal from "../calculateCategoryTotalForCurrentWindow";

export default function getCategoryDistribution(expenses: Expense[], month: Date, categories: ExpenseCategory[]): NameTotalSet[] {
    return categories.map((category) => {
        return {
            name: category.name,
            total: calculateMonthlyCategoryTotal(expenses, month, category)
        }
    });
}