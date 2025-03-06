import { Contract } from "@hyperledger/fabric-gateway";
import RecurringIncome from "../models/recurrenceModels/RecurringIncome";
import { TextDecoder } from 'util';
import BasicRecurrenceRule from "../models/recurrenceModels/BasicRecurrenceRule";


const utf8Decoder = new TextDecoder();


export async function createRecurringIncome(contract: Contract, e: RecurringIncome): Promise<void> {
    try {
        await contract.submitTransaction(
            "createRecurringIncome",
            JSON.stringify(e.toJSON())
        )

    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function updateRecurringIncome(contract: Contract, e: RecurringIncome) {
    try {
        await contract.submitTransaction(
            "updateRecurringIncome",
            JSON.stringify(e.toJSON())
        )

    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function deleteRecurringIncome(contract: Contract, userID: string, incomeID: string) {
    try {
        await contract.submitTransaction(
            "deleteRecurringIncome",
            userID,
            incomeID,
        )

        return true
    } catch (err: any) {
        console.log(err)
    }

    return false
}


export async function listRecurringIncomesByUser(contract: Contract, userID: string): Promise<RecurringIncome[]> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "listRecurringIncomesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const recurringIncomes: RecurringIncome[] = result.recurringIncomes.map((i: any) => {
            const recurrenceRule = new BasicRecurrenceRule(i.recurrenceRule.frequency, i.recurrenceRule.interval, new Date(i.recurrenceRule.startDate), new Date(i.recurrenceRule.nextTriggerDate), i.recurrenceRule.endDate ? new Date(i.recurrenceRule.endDate): undefined)
            return new RecurringIncome(i.userID, i.title, i.amount, new Date(i.date), i.notes, recurrenceRule, i.id);
        });
        return recurringIncomes;
    } catch (err: any) {
        console.log(err)
    }

    return [];
}


export async function getRecurringIncomeByID(contract: Contract, userID: string, id: string): Promise<RecurringIncome | undefined> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "getRecurringIncomeByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const data = JSON.parse(resultJson);
        const recurrenceRule = new BasicRecurrenceRule(data.recurrenceRule.frequency, data.recurrenceRule.interval, new Date(data.recurrenceRule.startDate), new Date(data.recurrenceRule.nextTriggerDate), data.recurrenceRule.endDate ? new Date(data.recurrenceRule.endDate): undefined)
        return new RecurringIncome(data.userID, data.title, data.amount, new Date(data.date), data.notes, recurrenceRule, data.id);
    } catch (err) {
        console.log(err)
    }

    return undefined;
}




// Not needed for testing
// export async function listAllRecurringIncomes(contract: Contract): Promise<RecurringIncome[]> {
//     console.log('\n--> Evaluate Transaction: List All Recurring Incomes,');

//     try {
//         const resultBytes = await contract.evaluateTransaction(
//             "listAllRecurringIncomes",
//         )

//         const resultJson = utf8Decoder.decode(resultBytes);
//         const result = JSON.parse(resultJson);
//         const recurringIncomes: RecurringIncome[] = result.recurringIncomes;
//         console.log(recurringIncomes);
//         return recurringIncomes
//     } catch (err) {
//         console.log("Failed To Get All Recurring Incomes")
//         console.log(err)
//     }

//     return [];
// }