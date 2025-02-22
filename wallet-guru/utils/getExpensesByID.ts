import Expense from "@/models/Expense";

export default async function getExpenseByID(token: string, id: string): Promise<Expense> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_EXPENSE_URL = `http://${API_DOMAIN}/api/expenses/${id}`;

    const response = await fetch(GET_EXPENSE_URL, {
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
    return new Expense(data.userID, data.title, data.amount, new Date(data.date), data.notes, data.categoryID, data.receipt, data.id);
}