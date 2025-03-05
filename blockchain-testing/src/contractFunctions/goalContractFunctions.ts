import { Contract } from "@hyperledger/fabric-gateway";
import Goal from "../models/core/Goal";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();


export async function createGoal(contract: Contract, i: Goal): Promise<void> {
    try {
        await contract.submitTransaction(
            "createGoal",
            JSON.stringify(i.toJSON())
        )
    } catch (err: any) {
        console.log(err)
    }

    return
}





export async function updateGoal(contract: Contract, userID: string, goalID: string, current: number) {
    try {
        await contract.submitTransaction(
            "updateGoal",
            userID,
            goalID,
            current.toString(),
        )

    } catch (err: any) {
        console.log(err)
    }

    return
}


export async function deleteGoal(contract: Contract, userID: string, goalID: string): Promise<boolean> {
    try {
        await contract.submitTransaction(
            "deleteGoal",
            userID,
            goalID
        )

        return true
    } catch (err: any) {
        console.log(err)
    }

    return false
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
        const goals: Goal[] = result.goals.map((goal: any) => new Goal(goal.title, goal.userID, goal.description, goal.target, new Date(goal.targetDate), goal.status, goal.id, goal.current));
        return goals
    } catch (err) {
        console.log(err)
    }

    return [];
}


export async function getGoalByID(contract: Contract, userID: string, id: string): Promise<Goal | undefined> {
    try {
        const resultBytes = await contract.evaluateTransaction(
            "getGoalByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const data = JSON.parse(resultJson);
        return new Goal(data.title, data.userID, data.description, data.target, new Date(data.targetDate), data.status, data.id, data.current);
    } catch (err) {
        console.log(err)
    }

    return undefined;
}