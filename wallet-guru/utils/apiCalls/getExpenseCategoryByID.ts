import ExpenseCategory from "@/models/ExpenseCategory";

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
        throw new Error(error.message);
    };

    const data: any = await response.json();
    return new ExpenseCategory(data.userID, data.name, data.monthlyBudget, data.id);
}