import RecurrenceRule from "@/models/recurrenceModels/RecurrenceRule"

export default async function updateRecurrentIncome(token: string, id: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.")
    };

    const ADD_RECURRING_INCOME_URL = `http://${API_DOMAIN}/api/recurring-incomes/${id}`

    const response = await fetch(ADD_RECURRING_INCOME_URL, {
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
            categoryID,
            recurrenceRule
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }

    return true
}