import BasicRecurrenceRule from "@/models/recurrenceModels/BasicRecurrenceRule";

export default async function updateExpenseCategory(token: string, id: string, name: string, monthlyBudget: number, recurrenceRule: BasicRecurrenceRule): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const UPDATE_EXPENSE_CATEGORY_URL = `http://${API_DOMAIN}/api/expense-categories/${id}`;

    const response = await fetch(UPDATE_EXPENSE_CATEGORY_URL, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            monthlyBudget,
            recurrenceRule
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    };

    return true;
}