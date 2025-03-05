import { Contract } from "@hyperledger/fabric-gateway";
import Expense from "../models/core/Expense";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();


export async function createExpense(contract: Contract, e: Expense): Promise<void> {
    try {
        await contract.submitTransaction(
            "createExpense",
            JSON.stringify(e.toJSON())
        )

    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function updateExpense(contract: Contract, e: Expense) {
    try {
        await contract.submitTransaction(
            "updateExpense",
            JSON.stringify(e.toJSON())
        )

    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function deleteExpense(contract: Contract, userID: string, expenseID: string): Promise<boolean> {
    try {
        await contract.submitTransaction(
            "deleteExpense",
            userID,
            expenseID
        )

        return true
    } catch (err: any) {
        console.log(err)
    }

    return false
}


export async function listExpensesByUser(contract: Contract, userID: string): Promise<Expense[]> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "listExpensesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const expenses: Expense[] = result.expenses.map((e: any) => new Expense(e.userID, e.title, e.amount, new Date(e.date), e.notes, e.categoryID, e.receipt, e.id));
        return expenses
    } catch (err) {
        console.log(err)
    }

    return [];
}


export async function getExpenseByID(contract: Contract, userID: string, id: string): Promise<Expense | undefined> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "getExpenseByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const data = JSON.parse(resultJson);
        return new Expense(data.userID, data.title, data.amount, new Date(data.date), data.notes, data.categoryID, data.receipt, data.id);;
    } catch (err) {
        console.log(err)
    }

    return undefined;
}