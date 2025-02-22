import Expense from "@/models/Expense";

export default async function getExpenses(token: string): Promise<Expense[]> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_EXPENSES_URL = `http://${API_DOMAIN}/api/expenses/`

    const response = await fetch(GET_EXPENSES_URL, {
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
    const expenses: Expense[] = data.expenses.map((e: any) => new Expense(e.userID, e.title, e.amount, e.date, e.notes, e.expenseCategoryID, e.receipt, e.id));
    return expenses;
}