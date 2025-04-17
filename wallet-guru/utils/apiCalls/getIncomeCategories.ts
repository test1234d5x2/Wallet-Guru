import IncomeCategory from "@/models/core/IncomeCategory"

export default async function getIncomeCategories(token: string): Promise<IncomeCategory[]> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.")
    }

    const GET_INCOME_CATEGORIES_URL = `http://${API_DOMAIN}/api/income-categories`

    const response = await fetch(GET_INCOME_CATEGORIES_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },

    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }

    const data = await response.json()
    const categories: IncomeCategory[] = data.categories.map((category: any) => {return new IncomeCategory(category.userID, category.name, category.id, category.colour)})

    return categories
}