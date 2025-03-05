import ExpenseCategory from "../models/core/ExpenseCategory";


export function testExpenseCategoryDetails(data: ExpenseCategory, expected: ExpenseCategory): boolean {
    let result = true

    console.log(`ID: ${data.getID()} === ${expected.getID()}`)

    if (data.getID() !== expected.getID()) {
        result = false;
    }

    console.log(`User ID: ${data.getUserID()} === ${expected.getUserID()}`)

    if (data.name !== expected.name) {
        result = false;
    }

    console.log(`Monthly Budget: ${data.monthlyBudget} === ${expected.monthlyBudget}`)

    if (data.monthlyBudget !== expected.monthlyBudget) {
        result = false;
    }

    console.log(`Recurrence Rule: ${data.recurrenceRule.toJSON()} === ${expected.recurrenceRule.toJSON()}`)

    if (data.recurrenceRule.toJSON() !== expected.recurrenceRule.toJSON()) {
        result = false;
    }

    return result
}