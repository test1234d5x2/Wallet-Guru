import { Contract } from "@hyperledger/fabric-gateway";
import Income from "../models/core/Income";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();


export async function createIncome(contract: Contract, i: Income): Promise<void> {
    console.log('\n--> Submit Transaction: Create Income,');

    try {
        await contract.submitTransaction(
            "createIncome",
            JSON.stringify(i.toJSON())
        )

        console.log("Created Income")
    } catch (err: any) {
        console.log(err)
    }

    return
}

export async function updateIncome(contract: Contract, i: Income) {
    console.log('\n--> Submit Transaction: Update Income,');

    try {
        await contract.submitTransaction(
            "updateIncome",
            JSON.stringify(i.toJSON())
        )

        console.log("Updated Income")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function deleteIncome(contract: Contract, userID: string, incomeID: string) {
    console.log('\n--> Submit Transaction: Delete Income,');

    try {
        await contract.submitTransaction(
            "deleteIncome",
            userID,
            incomeID
        )

        console.log("Deleted Income")
    } catch (err: any) {
        console.log(err)
    }

    return
}




export async function listIncomesByUser(contract: Contract, userID: string): Promise<Income[]> {
    console.log('\n--> Evaluate Transaction: List Income By User,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listIncomesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const incomes: Income[] = result.incomes;

        console.log(incomes)
        return incomes
    } catch (err) {
        console.log("Failed To Get Incomes")
        console.log(err)
    }

    return [];
}


export async function getIncomeByID(contract: Contract, userID: string, id: string): Promise<Income | undefined> {
    console.log('\n--> Evaluate Transaction: Find Income By ID,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "getIncomeByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(result)
        return result;
    } catch (err) {
        console.log("Failed To Get Income");
        console.log(err)
    }

    return undefined;
}