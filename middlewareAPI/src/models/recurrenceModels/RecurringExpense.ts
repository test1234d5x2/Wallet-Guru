import Expense from "../core/Expense";
import RecurrenceRule from "./RecurrenceRule";
import RecurringTransaction from "./RecurringTransaction";

export default class RecurringExpense extends Expense implements RecurringTransaction {
    recurrenceRule: RecurrenceRule;

    constructor(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule) {
        super(userID, title, amount, date, notes, categoryID, "");
        this.recurrenceRule = recurrenceRule;
    }

    getPageURL(): string {
        return "/viewRecurringExpenseDetailsPage/" + this.getID();
    }

    getEditURL(): string {
        return "/editRecurringExpensePage/" + this.getID();
    }
}