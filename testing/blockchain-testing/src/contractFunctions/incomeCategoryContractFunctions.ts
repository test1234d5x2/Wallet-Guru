import { Contract } from "@hyperledger/fabric-gateway"
import { TextDecoder } from 'util'
import IncomeCategory from "../models/core/IncomeCategory"

const utf8Decoder = new TextDecoder()

export async function createIncomeCategory(contract: Contract, ec: IncomeCategory): Promise<void> {
    await contract.submitTransaction(
        "createIncomeCategory",
        JSON.stringify(ec.toJSON())
    ).catch((err: Error) => {
        console.log(err)
    })

    return
}

export async function updateIncomeCategory(contract: Contract, ec: IncomeCategory): Promise<void> {
    await contract.submitTransaction(
        "updateIncomeCategory",
        JSON.stringify(ec.toJSON())
    ).catch((err: Error) => {
        console.log(err)
    })

    return
}

export async function listIncomeCategoriesByUser(contract: Contract, userID: string): Promise<IncomeCategory[]> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "listIncomeCategoriesByUser",
            userID
        )

        const resultJson = utf8Decoder.decode(resultBytes)
        const result = JSON.parse(resultJson)
        const categories: IncomeCategory[] = result.categories.map((category: any) => {return new IncomeCategory(category.userID, category.name, category.id, category.colour)})
        return categories
    } catch (err) {
        console.log(err)
    }

    return []
}

export async function getIncomeCategoryByID(contract: Contract, userID: string, id: string): Promise<IncomeCategory | undefined> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "getIncomeCategoryByID",
            userID,
            id
        )

        const resultJson = utf8Decoder.decode(resultBytes)
        const result = JSON.parse(resultJson)
        const data: IncomeCategory = new IncomeCategory(result.userID, result.name, result.id, result.colour)
        return data
    } catch (err) {
        console.log(err)
    }

    return undefined
}

export async function deleteIncomeCategory(contract: Contract, userID: string, id: string): Promise<boolean> {
    try {
        await contract.submitTransaction(
            "deleteIncomeCategory",
            userID,
            id
        )

        return true
    }
    catch (err: any) {
        console.log(err)
    }

    return false
}
