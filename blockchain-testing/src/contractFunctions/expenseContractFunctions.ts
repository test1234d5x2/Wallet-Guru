import { Contract } from "@hyperledger/fabric-gateway";
import Expense from "../models/core/Expense";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();


export async function createExpense(contract: Contract, e: Expense): Promise<void> {
    console.log('\n--> Submit Transaction: Create Expense,');

    try {
        await contract.submitTransaction(
            "createExpense",
            JSON.stringify(e.toJSON())
        )

        console.log("Created Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function updateExpense(contract: Contract, e: Expense) {
    console.log('\n--> Submit Transaction: Update Expense,');

    try {
        await contract.submitTransaction(
            "updateExpense",
            JSON.stringify(e.toJSON())
        )

        console.log("Updated Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function deleteExpense(contract: Contract, userID: string, expenseID: string) {
    console.log('\n--> Submit Transaction: Delete Expense,');

    try {
        await contract.submitTransaction(
            "deleteExpense",
            userID,
            expenseID
        )

        console.log("Deleted Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function listExpensesByUser(contract: Contract, userID: string): Promise<Expense[]> {
    console.log('\n--> Evaluate Transaction: List Expenses By User,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listExpensesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const expenses: Expense[] = result.expenses;

        console.log(expenses)
        return expenses
    } catch (err) {
        console.log("Failed To Get Expenses")
        console.log(err)
    }

    return [];
}


export async function getExpenseByID(contract: Contract, userID: string, id: string): Promise<Expense | undefined> {
    console.log('\n--> Evaluate Transaction: Find Expense By ID,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "getExpenseByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(result)
        return result;
    } catch (err) {
        console.log("Failed To Get Expense");
        console.log(err)
    }

    return undefined;
}