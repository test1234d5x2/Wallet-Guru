import IncomeCategory from "@/models/core/IncomeCategory"

export default async function getIncomeCategoryByID(token: string, id: string): Promise<IncomeCategory> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.")
    }

    const GET_INCOME_CATEGORY_URL = `http://${API_DOMAIN}/api/income-categories/${id}`

    const response = await fetch(GET_INCOME_CATEGORY_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
    }

    const data: any = await response.json()
    return new IncomeCategory(data.userID, data.name, data.id, data.colour)
}