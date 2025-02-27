import Expense from "@/models/core/Expense";
import ExpenseCategory from "@/models/core/ExpenseCategory";
import NameTotalSet from "@/models/analytics/NameTotalSet";
import calculateCategoryTotalForCurrentWindow from "../calculateCategoryTotalForCurrentWindow";

export default function getCategoryDistribution(expenses: Expense[], categories: ExpenseCategory[]): NameTotalSet[] {
    return categories.map((category) => {
        return {
            name: category.name,
            total: calculateCategoryTotalForCurrentWindow(expenses, category)
        }
    });
}