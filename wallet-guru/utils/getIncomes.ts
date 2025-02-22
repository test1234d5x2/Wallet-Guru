import Income from "@/models/Income";

export default async function getIncomes(token: string): Promise<Income[]> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_INCOMES_URL = `http://${API_DOMAIN}/api/expenses/`

    const response = await fetch(GET_INCOMES_URL, {
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
    const incomes: Income[] = data.incomes;
    return incomes;
}