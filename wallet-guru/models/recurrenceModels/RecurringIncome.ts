import Income from "../core/Income"
import RecurrenceRule from "./RecurrenceRule"
import RecurringTransaction from "./RecurringTransaction"

export default class RecurringIncome extends Income implements RecurringTransaction {
    recurrenceRule: RecurrenceRule

    constructor(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule, id?: string) {
        super(userID, title, amount, date, notes, categoryID, id)
        this.recurrenceRule = recurrenceRule
    }

    getEditURL(): string {
        return "/editRecurringIncomePage/" + this.getID()
    }

    getPageURL(): string {
        return "/viewRecurringIncomeDetailsPage/" + this.getID()
    }
}