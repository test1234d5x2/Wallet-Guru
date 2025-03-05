import ExpenseCategory from "../models/core/ExpenseCategory";
import testRecurrenceRuleDetails from "./recurrenceRuleTests";


export function testExpenseCategoryDetails(data: ExpenseCategory, expected: ExpenseCategory): boolean {
    let result = true

    console.log(`ID: ${data.getID()} === ${expected.getID()}`)

    if (data.getID() !== expected.getID()) {
        result = false;
    }

    console.log(`User ID: ${data.getUserID()} === ${expected.getUserID()}`)

    if (data.getUserID() !== expected.getUserID()) {
        result = false;
    }

    console.log(`Name: ${data.name} === ${expected.name}`)

    if (data.name !== expected.name) {
        result = false;
    }

    console.log(`Monthly Budget: ${data.monthlyBudget} === ${expected.monthlyBudget}`)

    if (data.monthlyBudget !== expected.monthlyBudget) {
        result = false;
    }

    console.log("Recurrence Rule Tests:")
    result = testRecurrenceRuleDetails(data.recurrenceRule, expected.recurrenceRule);

    return result
}