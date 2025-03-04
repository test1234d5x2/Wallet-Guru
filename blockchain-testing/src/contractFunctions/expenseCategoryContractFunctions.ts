import { Contract } from "@hyperledger/fabric-gateway";
import ExpenseCategory from "../models/core/ExpenseCategory";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();


export async function createExpenseCategory(contract: Contract, ec: ExpenseCategory): Promise<void> {
    console.log('\n--> Submit Transaction: Create Expense Category,');

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
    console.log('\n--> Submit Transaction: Update Expense Category,');


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
    console.log('\n--> Evaluate Transaction: List Expense Categories By User,');

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
    console.log('\n--> Evaluate Transaction: Find Expense Category By ID,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "getExpenseCategoryByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(result)
        return result;
    } catch (err) {
        console.log("Failed To Get Expense Category");
        console.log(err)
    }

    return undefined;
}




export async function deleteExpenseCategory(contract: Contract, userID: string, id: string): Promise<boolean> {
    console.log('\n--> Submit Transaction: Delete Expense Category,');

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