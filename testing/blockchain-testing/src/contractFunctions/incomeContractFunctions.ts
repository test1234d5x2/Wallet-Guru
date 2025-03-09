import { Contract } from "@hyperledger/fabric-gateway";
import Income from "../models/core/Income";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();


export async function createIncome(contract: Contract, i: Income): Promise<void> {
    try {
        await contract.submitTransaction(
            "createIncome",
            JSON.stringify(i.toJSON())
        )

    } catch (err: any) {
        console.log(err)
    }

    return
}

export async function updateIncome(contract: Contract, i: Income) {
    try {
        await contract.submitTransaction(
            "updateIncome",
            JSON.stringify(i.toJSON())
        )

    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function deleteIncome(contract: Contract, userID: string, incomeID: string): Promise<boolean> {
    try {
        await contract.submitTransaction(
            "deleteIncome",
            userID,
            incomeID
        )

        return true
    } catch (err: any) {
        console.log(err)
    }

    return false
}




export async function listIncomesByUser(contract: Contract, userID: string): Promise<Income[]> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "listIncomesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const incomes: Income[] = result.incomes.map((i: any) => new Income(i.userID, i.title, i.amount, new Date(i.date), i.notes, i.id));
        return incomes
    } catch (err) {
        console.log(err)
    }

    return [];
}


export async function getIncomeByID(contract: Contract, userID: string, id: string): Promise<Income | undefined> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "getIncomeByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const data = JSON.parse(resultJson);
        return new Income(data.userID, data.title, data.amount, new Date(data.date), data.notes, data.id);
    } catch (err) {
        console.log(err)
    }

    return undefined;
}