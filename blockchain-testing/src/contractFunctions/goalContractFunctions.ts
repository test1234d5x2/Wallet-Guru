import { Contract } from "@hyperledger/fabric-gateway";
import Goal from "../models/core/Goal";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();


export async function createGoal(contract: Contract, i: Goal): Promise<void> {
    console.log('\n--> Submit Transaction: Create Goal,');

    try {
        await contract.submitTransaction(
            "createGoal",
            JSON.stringify(i.toJSON())
        )

        console.log("Created Goal")
    } catch (err: any) {
        console.log(err)
    }

    return
}





export async function updateGoal(contract: Contract, userID: string, goalID: string, current: number) {
    console.log('\n--> Submit Transaction: Update Goal,');

    try {
        await contract.submitTransaction(
            "updateGoal",
            userID,
            goalID,
            current.toString(),
        )

        console.log("Updated Goal")
    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function deleteGoal(contract: Contract, userID: string, goalID: string) {
    console.log('\n--> Submit Transaction: Delete Goal,');

    try {
        await contract.submitTransaction(
            "deleteGoal",
            userID,
            goalID
        )

        console.log("Deleted Goal")
    } catch (err: any) {
        console.log(err)
    }

    return
}



export async function listGoalsByUser(contract: Contract, userID: string): Promise<Goal[]> {
    console.log('\n--> Evaluate Transaction: List Goal By User,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listGoalsByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const goals: Goal[] = result.goals;

        console.log(goals)
        return goals
    } catch {
        console.log("Failed To Get Goals")
    }

    return [];
}


export async function getGoalByID(contract: Contract, userID: string, id: string): Promise<Goal | undefined> {
    console.log('\n--> Evaluate Transaction: Find Expense By ID,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "getGoalByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(result)
        return result;
    } catch (err) {
        console.log("Failed To Get Goal");
        console.log(err)
    }

    return undefined;
}