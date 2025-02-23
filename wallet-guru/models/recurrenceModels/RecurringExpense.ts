import Expense from "../core/Expense";
import RecurrenceRule from "./RecurrenceRule";
import RecurringTransaction from "./RecurringTransaction";

class RecurringExpense extends Expense implements RecurringTransaction {
    recurrenceRule: RecurrenceRule;

    constructor(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule, receipt?: string, id?: string) {
        super(userID, title, amount, date, notes, categoryID, receipt, id);
        this.recurrenceRule = recurrenceRule;
    }
}