export default async function updateExpense(token: string, id: string, title: string, amount: number, date: Date, notes: string, expenseCategoryID: string, receipt?: string): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const UPDATE_EXPENSE_URL = `http://${API_DOMAIN}/api/expenses/${id}`;

    const response = await fetch(UPDATE_EXPENSE_URL, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            amount,
            date,
            notes,
            expenseCategoryID,
            receipt: !receipt ? '' : receipt

        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    };

    return true;
}