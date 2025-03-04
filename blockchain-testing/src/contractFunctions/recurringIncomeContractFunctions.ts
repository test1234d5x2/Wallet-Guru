import { Contract } from "@hyperledger/fabric-gateway";
import RecurringIncome from "../models/recurrenceModels/RecurringIncome";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();


export async function createRecurringIncome(contract: Contract, e: RecurringIncome): Promise<void> {
    console.log('\n--> Submit Transaction: Create Recurring Income,');

    try {
        await contract.submitTransaction(
            "createRecurringIncome",
            JSON.stringify(e.toJSON())
        )

        console.log("Created Recurring Income")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function updateRecurringIncome(contract: Contract, e: RecurringIncome) {
    console.log('\n--> Submit Transaction: Update Recurring Income,');

    try {
        await contract.submitTransaction(
            "updateRecurringIncome",
            JSON.stringify(e.toJSON())
        )

        console.log("Updated Recurring Income")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function deleteRecurringIncome(contract: Contract, userID: string, incomeID: string) {
    console.log('\n--> Submit Transaction: Delete Recurring Income,');

    try {
        await contract.submitTransaction(
            "deleteRecurringIncome",
            userID,
            incomeID,
        )

        console.log("Deleted Recurring Income")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function listRecurringIncomesByUser(contract: Contract, userID: string): Promise<RecurringIncome[]> {
    console.log('\n--> Evaluate Transaction: List Recurring Incomes By User,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listRecurringIncomesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const recurringIncomes: RecurringIncome[] = result.recurringIncomes;

        console.log(recurringIncomes)
        return recurringIncomes
    } catch (err: any) {
        console.log("Failed To Get Recurring Incomes")
        console.log(err)
    }

    return [];
}


export async function getRecurringIncomeByID(contract: Contract, userID: string, id: string): Promise<RecurringIncome | undefined> {
    console.log('\n--> Evaluate Transaction: Find Recurring Income By ID,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "getRecurringIncomeByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(result)
        return result;
    } catch (err) {
        console.log("Failed To Get Recurring Income");
        console.log(err)
    }

    return undefined;
}





export async function listAllRecurringIncomes(contract: Contract): Promise<RecurringIncome[]> {
    console.log('\n--> Evaluate Transaction: List All Recurring Incomes,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listAllRecurringIncomes",
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const recurringIncomes: RecurringIncome[] = result.recurringIncomes;
        console.log(recurringIncomes);
        return recurringIncomes
    } catch (err) {
        console.log("Failed To Get All Recurring Incomes")
        console.log(err)
    }

    return [];
}