import { Contract } from "@hyperledger/fabric-gateway";
import RecurringExpense from "../models/recurrenceModels/RecurringExpense";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();


export async function createRecurringExpense(contract: Contract, e: RecurringExpense): Promise<void> {
    console.log('\n--> Submit Transaction: Create Recurring Expense,');

    try {
        await contract.submitTransaction(
            "createRecurringExpense",
            JSON.stringify(e.toJSON())
        )

        console.log("Created Recurring Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function updateRecurringExpense(contract: Contract, e: RecurringExpense) {
    console.log('\n--> Submit Transaction: Update Recurring Expense,');

    try {
        await contract.submitTransaction(
            "updateRecurringExpense",
            JSON.stringify(e.toJSON())
        )

        console.log("Updated Recurring Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function deleteRecurringExpense(contract: Contract, userID: string, expenseID: string) {
    console.log('\n--> Submit Transaction: Delete Recurring Expense,');

    try {
        await contract.submitTransaction(
            "deleteRecurringExpense",
            userID,
            expenseID
        )

        console.log("Deleted Recurring Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function listRecurringExpensesByUser(contract: Contract, userID: string): Promise<RecurringExpense[]> {
    console.log('\n--> Evaluate Transaction: List Recurring Expenses By User,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listRecurringExpensesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const recurringExpenses: RecurringExpense[] = result.recurringExpenses;

        console.log(recurringExpenses)
        return recurringExpenses
    } catch (err) {
        console.log("Failed To Get Recurring Expenses")
        console.log(err)
    }

    return [];
}


export async function getRecurringExpenseByID(contract: Contract, userID: string, id: string): Promise<RecurringExpense | undefined> {
    console.log('\n--> Evaluate Transaction: Find Recurring Expense By ID,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "getRecurringExpenseByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(result)
        return result;
    } catch (err) {
        console.log("Failed To Get Recurring Expense");
        console.log(err)
    }

    return undefined;
}


export async function listAllRecurringExpenses(contract: Contract): Promise<RecurringExpense[]> {
    console.log('\n--> Evaluate Transaction: List All Recurring Expenses,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listAllRecurringExpenses",
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const recurringExpenses: RecurringExpense[] = result.recurringExpenses;
        console.log(recurringExpenses);
        return recurringExpenses
    } catch (err) {
        console.log("Failed To Get All Recurring Expenses")
        console.log(err)
    }

    return [];
}