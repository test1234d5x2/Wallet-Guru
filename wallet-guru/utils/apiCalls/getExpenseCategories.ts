import ExpenseCategory from "@/models/ExpenseCategory";

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
    const categories: ExpenseCategory[] = data.categories.map((category: any) => new ExpenseCategory(category.userID, category.name, category.monthlyBudget, category.id));
    return categories;
}