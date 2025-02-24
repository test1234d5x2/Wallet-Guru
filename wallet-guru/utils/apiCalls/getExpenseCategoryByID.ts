import ExpenseCategory from "@/models/core/ExpenseCategory";
import BasicRecurrenceRule from "@/models/recurrenceModels/BasicRecurrenceRule";
import RecurrenceRule from "@/models/recurrenceModels/RecurrenceRule";

export default async function getExpenseCategoryByID(token: string, id: string): Promise<ExpenseCategory> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_EXPENSE_CATEGORY_URL = `http://${API_DOMAIN}/api/expense-categories/${id}`;

    const response = await fetch(GET_EXPENSE_CATEGORY_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    };

    const data: any = await response.json();
    const recurrenceRule: RecurrenceRule = new BasicRecurrenceRule(data.recurrenceRule.frequency, data.recurrenceRule.interval, new Date(data.recurrenceRule.startDate))
    return new ExpenseCategory(data.userID, data.name, data.monthlyBudget, recurrenceRule, data.id);
}