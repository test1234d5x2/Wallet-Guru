import ExpenseCategory from "@/models/core/ExpenseCategory";
import updateExpenseCategory from "@/utils/apiCalls/updateExpenseCategory";

export default async function updateCategoriesTimeWindowEnd(categories: ExpenseCategory[], token: string): Promise<void> {
    categories.forEach( async (cat) => {
        if (cat.recurrenceRule.shouldTrigger()) {
            cat.recurrenceRule.computeNextTriggerDate()
            await updateExpenseCategory(token, cat.getID(), cat.name, cat.monthlyBudget, cat.recurrenceRule);
        }
    })
}