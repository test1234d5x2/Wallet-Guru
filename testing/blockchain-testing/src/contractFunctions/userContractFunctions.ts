import { Contract } from "@hyperledger/fabric-gateway"
import User from "../models/core/User"
import { TextDecoder } from 'util'

const utf8Decoder = new TextDecoder()

export async function createNewUser(contract: Contract, id: string, email: string, password: string, date: Date): Promise<void> {
    await contract.submitTransaction(
        'createUser',
        id,
        email,
        password,
        date.toISOString()
    ).catch((err: Error) => {
        console.log(err)
    })

    return
}

export async function loginUser(contract: Contract, email: string, password: string): Promise<string> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            'loginUser',
            email,
            password
        )

        const resultJson = utf8Decoder.decode(resultBytes)
        const result = JSON.parse(resultJson)
        return result.userID
    } catch (err) {
        console.log(err)
    }

    return ""
}

export async function deleteUser(contract: Contract, email: string): Promise<boolean> {
    try {
        await contract.submitTransaction(
            'deleteUser',
            email
        )

        return true
    } catch (err: any) {
        console.log(err)
    }

    return false
}

export async function userExists(contract: Contract, email: string): Promise<boolean> {
    try {
        await contract.evaluateTransaction(
            "userExists",
            email
        )

        return true
    }
    catch (err) {
        console.log(err)
    }

    return false
}

export async function findByID(contract: Contract, userID: string): Promise<User | undefined> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "findByID",
            userID
        )

        const resultJson = utf8Decoder.decode(resultBytes)
        const data = JSON.parse(resultJson)
        const user: User = new User(data.email, data.password, data.id, new Date(data.dateJoined), data.status)
        return user
    }
    catch (err) {
        console.log(err)
    }

    return undefined
}

export async function changePassword(contract: Contract, email: string, newPassword: string): Promise<void> {
    try {
        await contract.submitTransaction(
            "changePassword",
            email,
            newPassword
        )
    }
    catch (err) {
        console.log(err)
    }

    return
}
