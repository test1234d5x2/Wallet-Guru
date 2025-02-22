export default async function deleteExpenseCategory(token: string, id: string): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const DELETE_EXPENSE_CATEGORY_URL = `http://${API_DOMAIN}/api/expense-categories/${id}`;

    const response = await fetch(DELETE_EXPENSE_CATEGORY_URL, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    };

    return true;
}