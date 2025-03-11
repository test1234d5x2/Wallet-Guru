import Transaction from "../core/Transaction"
import RecurrenceRule from "./RecurrenceRule"

export default interface RecurringTransaction extends Transaction {
    recurrenceRule: RecurrenceRule
}
