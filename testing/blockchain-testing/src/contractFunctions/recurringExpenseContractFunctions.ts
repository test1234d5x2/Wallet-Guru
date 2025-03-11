import { Contract } from "@hyperledger/fabric-gateway"
import RecurringExpense from "../models/recurrenceModels/RecurringExpense"
import { TextDecoder } from 'util'
import BasicRecurrenceRule from "../models/recurrenceModels/BasicRecurrenceRule"

const utf8Decoder = new TextDecoder()

export async function createRecurringExpense(contract: Contract, e: RecurringExpense): Promise<void> {
    try {
        await contract.submitTransaction(
            "createRecurringExpense",
            JSON.stringify(e.toJSON())
        )
    } catch (err: any) {
        console.log(err)
    }

    return
}

export async function updateRecurringExpense(contract: Contract, e: RecurringExpense) {
    try {
        await contract.submitTransaction(
            "updateRecurringExpense",
            JSON.stringify(e.toJSON())
        )
    } catch (err: any) {
        console.log(err)
    }

    return
}

export async function deleteRecurringExpense(contract: Contract, userID: string, expenseID: string): Promise<boolean> {
    try {
        await contract.submitTransaction(
            "deleteRecurringExpense",
            userID,
            expenseID
        )

        return true
    } catch (err: any) {
        console.log(err)
    }

    return false
}

export async function listRecurringExpensesByUser(contract: Contract, userID: string): Promise<RecurringExpense[]> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "listRecurringExpensesByUser",
            userID
        )

        const resultJson = utf8Decoder.decode(resultBytes)
        const result = JSON.parse(resultJson)
        const recurringExpenses: RecurringExpense[] = result.recurringExpenses.map((e: any) => {
            const recurrenceRule = new BasicRecurrenceRule(e.recurrenceRule.frequency, e.recurrenceRule.interval, new Date(e.recurrenceRule.startDate), new Date(e.recurrenceRule.nextTriggerDate), e.recurrenceRule.endDate ? new Date(e.recurrenceRule.endDate) : undefined)
            return new RecurringExpense(e.userID, e.title, e.amount, new Date(e.date), e.notes, e.categoryID, recurrenceRule, e.id)
        })
        return recurringExpenses
    } catch (err) {
        console.log(err)
    }

    return []
}

export async function getRecurringExpenseByID(contract: Contract, userID: string, id: string): Promise<RecurringExpense | undefined> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "getRecurringExpenseByID",
            userID,
            id
        )

        const resultJson = utf8Decoder.decode(resultBytes)
        const data = JSON.parse(resultJson)
        const recurrenceRule = new BasicRecurrenceRule(data.recurrenceRule.frequency, data.recurrenceRule.interval, new Date(data.recurrenceRule.startDate), new Date(data.recurrenceRule.nextTriggerDate), data.recurrenceRule.endDate ? new Date(data.recurrenceRule.endDate) : undefined)
        return new RecurringExpense(data.userID, data.title, data.amount, new Date(data.date), data.notes, data.categoryID, recurrenceRule, data.id)
    } catch (err) {
        console.log(err)
    }

    return undefined
}

// Not needed for testing
// export async function listAllRecurringExpenses(contract: Contract): Promise<RecurringExpense[]> {
//     try {
//         const resultBytes = await contract.evaluateTransaction(
//             "listAllRecurringExpenses"
//         )

//         const resultJson = utf8Decoder.decode(resultBytes)
//         const result = JSON.parse(resultJson)
//         const recurringExpenses: RecurringExpense[] = result.recurringExpenses
//         return recurringExpenses
//     } catch (err) {
//         console.log(err)
//     }

//     return []
// }
