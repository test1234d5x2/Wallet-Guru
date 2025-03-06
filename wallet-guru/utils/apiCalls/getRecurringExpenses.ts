import BasicRecurrenceRule from "@/models/recurrenceModels/BasicRecurrenceRule";
import RecurringExpense from "@/models/recurrenceModels/RecurringExpense";


export default async function getRecurringExpenses(token: string): Promise<RecurringExpense[]> {
    const API_DOMAIN = process.env.EXPO_PUBLIC_BLOCKCHAIN_MIDDLEWARE_API_IP_ADDRESS;
    if (!API_DOMAIN) {
        throw new Error("Domain could not be found.");
    };

    const GET_RECCURING_EXPENSES_URL = `http://${API_DOMAIN}/api/recurring-expenses/`

    const response = await fetch(GET_RECCURING_EXPENSES_URL, {
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
    const recurringExpenses: RecurringExpense[] = data.recurringExpenses.map((e: any) => {
        const recurrenceRule = new BasicRecurrenceRule(e.recurrenceRule.frequency, e.recurrenceRule.interval, new Date(e.recurrenceRule.startDate), new Date(e.recurrenceRule.nextTriggerDate), e.recurrenceRule.endDate ? new Date(e.recurrenceRule.endDate): undefined)
        return new RecurringExpense(e.userID, e.title, e.amount, new Date(e.date), e.notes, e.categoryID, recurrenceRule, e.id);
    });
    return recurringExpenses;
}