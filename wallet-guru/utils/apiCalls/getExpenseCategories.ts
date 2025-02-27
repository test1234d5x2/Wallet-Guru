import ExpenseCategory from "@/models/core/ExpenseCategory";
import BasicRecurrenceRule from "@/models/recurrenceModels/BasicRecurrenceRule";

export default async function getExpenseCategories(token: string): Promise<ExpenseCategory[]> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_EXPENSE_CATEGORIES_URL = `http://${API_DOMAIN}/api/expense-categories`;

    const response = await fetch(GET_EXPENSE_CATEGORIES_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },

    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    const data = await response.json();
    const categories: ExpenseCategory[] = data.categories.map((category: any) => {
        const recurrenceRule = new BasicRecurrenceRule(
            category.recurrenceRule.frequency,
            category.recurrenceRule.interval, 
            new Date(category.recurrenceRule.startDate),
            category.recurrenceRule.nextTriggerDate ? new Date(category.recurrenceRule.nextTriggerDate): undefined,
            category.recurrenceRule.endDate ? new Date(category.recurrenceRule.endDate): undefined
        )
        return new ExpenseCategory(category.userID, category.name, category.monthlyBudget, recurrenceRule, category.id);
    });

    return categories;
}