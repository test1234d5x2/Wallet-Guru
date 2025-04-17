import BasicRecurrenceRule from "@/models/recurrenceModels/BasicRecurrenceRule"
import RecurringIncome from "@/models/recurrenceModels/RecurringIncome"

export default async function getRecurringIncomes(token: string): Promise<RecurringIncome[]> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.")
    }

    const GET_RECCURING_INCOMES_URL = `http://${API_DOMAIN}/api/recurring-incomes/`

    const response = await fetch(GET_RECCURING_INCOMES_URL, {
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
    const incomes: RecurringIncome[] = data.recurringIncomes.map((i: any) => {
        const recurrenceRule = new BasicRecurrenceRule(i.recurrenceRule.frequency, i.recurrenceRule.interval, new Date(i.recurrenceRule.startDate), new Date(i.recurrenceRule.nextTriggerDate), i.recurrenceRule.endDate ? new Date(i.recurrenceRule.endDate): undefined)
        return new RecurringIncome(i.userID, i.title, i.amount, new Date(i.date), i.notes, i.categoryID, recurrenceRule, i.id)
    })
    return incomes
}