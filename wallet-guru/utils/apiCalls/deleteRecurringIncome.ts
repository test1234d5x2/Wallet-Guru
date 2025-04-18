export default async function deleteRecurringIncome(token: string, id: string): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.")
    }

    const DELETE_RECURRING_EXPENSE_URL = `http://${API_DOMAIN}/api/recurring-incomes/${id}`

    const response = await fetch(DELETE_RECURRING_EXPENSE_URL, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }

    return true
}