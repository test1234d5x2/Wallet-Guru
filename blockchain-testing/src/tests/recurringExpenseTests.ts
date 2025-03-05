import RecurringExpense from "../models/recurrenceModels/RecurringExpense";
import testRecurrenceRuleDetails from "./recurrenceRuleTests";


export function testRecurrenceExpenseDetails(data: RecurringExpense, expected: RecurringExpense): boolean {
    let result = true

    console.log(`ID: ${data.getID()} === ${expected.getID()}`)

    if (data.getID() !== expected.getID()) {
        result = false;
    }

    console.log(`User ID: ${data.getUserID()} === ${expected.getUserID()}`)

    if (data.getUserID() !== expected.getUserID()) {
        result = false;
    }

    console.log(`Title: ${data.title} === ${expected.title}`)

    if (data.title !== expected.title) {
        result = false;
    }

    console.log(`Amount: ${data.amount} === ${expected.amount}`)

    if (data.amount !== expected.amount) {
        result = false;
    }

    console.log(`Date: ${data.date.toISOString()} === ${expected.date.toISOString()}`)

    if (data.date.getTime() !== expected.date.getTime()) {
        result = false;
    }

    console.log(`Notes: ${data.notes} === ${expected.notes}`)

    if (data.notes !== expected.notes) {
        result = false;
    }

    console.log(`Category ID: ${data.categoryID} === ${expected.categoryID}`)

    if (data.categoryID !== expected.categoryID) {
        result = false;
    }

    console.log(`Receipt: ${data.receipt} === ${expected.receipt}`)

    if (data.receipt !== expected.receipt) {
        result = false;
    }

    console.log("Recurrence Rule Tests:")
    result = testRecurrenceRuleDetails(data.recurrenceRule, expected.recurrenceRule);

    return result
}