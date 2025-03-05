import { Contract } from "@hyperledger/fabric-gateway";
import ExpenseCategory from "../models/core/ExpenseCategory";
import { TextDecoder } from 'util';
import BasicRecurrenceRule from "../models/recurrenceModels/BasicRecurrenceRule";


const utf8Decoder = new TextDecoder();


export async function createExpenseCategory(contract: Contract, ec: ExpenseCategory): Promise<void> {
    await contract.submitTransaction(
        "createExpenseCategory",
        JSON.stringify(ec.toJSON())
    ).then((data) => {
        console.log("Category Created")
    }).catch((err: Error) => {
        console.log(err)
    })

    return
}





export async function updateExpenseCategory(contract: Contract, ec: ExpenseCategory): Promise<void> {
    await contract.submitTransaction(
        "updateExpenseCategory",
        JSON.stringify(ec.toJSON()),
    ).then((data) => {
        console.log("Category Updated")
    }).catch((err: Error) => {
        console.log(err)
    })

    return
}




export async function listExpenseCategoriesByUser(contract: Contract, userID: string): Promise<ExpenseCategory[]> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "listExpenseCategoriesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const categories: ExpenseCategory[] = result.categories;

        console.log(categories)
        return categories
    } catch (err) {
        console.log("Failed To Get Expense Categories")
    }

    return [];
}






export async function getExpenseCategoryByID(contract: Contract, userID: string, id: string): Promise<ExpenseCategory | undefined> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "getExpenseCategoryByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const recurrenceRule = new BasicRecurrenceRule(
            result.recurrenceRule.frequency,
            result.recurrenceRule.interval,
            new Date(result.recurrenceRule.startDate),
            result.recurrenceRule.nextTriggerDate ? new Date(result.recurrenceRule.nextTriggerDate) : undefined,
            result.recurrenceRule.endDate ? new Date(result.recurrenceRule.endDate) : undefined
        )
        const data: ExpenseCategory = new ExpenseCategory(result.userID, result.name, result.monthlyBudget, recurrenceRule, result.id);
        return data;
    } catch (err) {
        console.log("Failed To Get Expense Category");
        console.log(err)
    }

    return undefined;
}




export async function deleteExpenseCategory(contract: Contract, userID: string, id: string): Promise<boolean> {
    try {
        await contract.submitTransaction(
            "deleteExpenseCategory",
            userID,
            id,
        )

        console.log("Deleted Expense Category")
        return true;
    }
    catch (err: any) {
        console.log(err)
    }

    return false
}