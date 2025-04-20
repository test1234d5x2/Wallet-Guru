import IncomeCategory from "../models/core/IncomeCategory"

export function testIncomeCategoryDetails(data: IncomeCategory, expected: IncomeCategory): boolean {
    let result = true

    console.log(`ID: ${data.getID()} === ${expected.getID()}`)

    if (data.getID() !== expected.getID()) {
        result = false
    }

    console.log(`User ID: ${data.getUserID()} === ${expected.getUserID()}`)

    if (data.getUserID() !== expected.getUserID()) {
        result = false
    }

    console.log(`Name: ${data.name} === ${expected.name}`)

    if (data.name !== expected.name) {
        result = false
    }

    console.log(`Colour: ${data.colour} === ${expected.colour}`)

    if (data.colour !== expected.colour) {
        result = false
    }

    return result
}
