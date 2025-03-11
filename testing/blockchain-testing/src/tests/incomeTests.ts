import Income from "../models/core/Income"

export function testIncomeDetails(data: Income, expected: Income): boolean {
    let result = true

    console.log(`ID: ${data.getID()} === ${expected.getID()}`)

    if (data.getID() !== expected.getID()) {
        result = false
    }

    console.log(`User ID: ${data.getUserID()} === ${expected.getUserID()}`)

    if (data.getUserID() !== expected.getUserID()) {
        result = false
    }

    console.log(`Title: ${data.title} === ${expected.title}`)

    if (data.title !== expected.title) {
        result = false
    }

    console.log(`Amount: ${data.amount} === ${expected.amount}`)

    if (data.amount !== expected.amount) {
        result = false
    }

    console.log(`Date: ${data.date.toISOString()} === ${expected.date.toISOString()}`)

    if (data.date.getTime() !== expected.date.getTime()) {
        result = false
    }

    console.log(`Notes: ${data.notes} === ${expected.notes}`)

    if (data.notes !== expected.notes) {
        result = false
    }

    return result
}
