import BasicRecurrenceRule from "@/models/recurrenceModels/BasicRecurrenceRule";
import RecurringIncome from "@/models/recurrenceModels/RecurringIncome";

export default async function getRecurringIncomeByID(token: string, id: string): Promise<RecurringIncome> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_RECURRING_INCOME_URL = `http://${API_DOMAIN}/api/recurring-incomes/${id}`;

    const response = await fetch(GET_RECURRING_INCOME_URL, {
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
    const recurrenceRule = new BasicRecurrenceRule(data.recurrenceRule.frequency, data.recurrenceRule.interval, new Date(data.recurrenceRule.startDate), new Date(data.recurrenceRule.nextTriggerDate), new Date(data.recurrenceRule.endDate))
    return new RecurringIncome(data.userID, data.title, data.amount, new Date(data.date), data.notes, recurrenceRule, data.id);
}