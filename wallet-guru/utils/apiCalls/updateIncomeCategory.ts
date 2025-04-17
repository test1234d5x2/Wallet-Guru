export default async function updateIncomeCategory(token: string, id: string, name: string, colour: string): Promise<boolean> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.")
    }

    const UPDATE_INCOME_CATEGORY_URL = `http://${API_DOMAIN}/api/income-categories/${id}`

    const response = await fetch(UPDATE_INCOME_CATEGORY_URL, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            colour,
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }

    return true
}