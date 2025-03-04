import { Contract } from "@hyperledger/fabric-gateway";
import User from "../models/core/User";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();


export async function createNewUser(contract: Contract, id: string, email: string, password: string, date: string): Promise<void> {
    console.log('\n--> Submit Transaction: Create User, creates new user with email and password');

    await contract.submitTransaction(
        'createUser',
        id,
        email,
        password,
        date,
    ).then((data) => {
        console.log('*** Transaction committed successfully');
    }).catch((err: Error) => {
        console.log(err)
    })

    return
}




export async function loginUser(contract: Contract, email: string, password: string): Promise<void> {
    console.log('\n--> Evaluate Transaction: Login User, checks whether a user exists with the email and password');

    await contract.evaluateTransaction(
        'loginUser',
        email,
        password,
    ).then((data) => {
        console.log("User is logged in now.");
    }).catch((err: Error) => {
        console.log(err);
    })

    try {
        const resultBytes = await contract.evaluateTransaction(
            'loginUser',
            email,
            password,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(`User ID: ${result.userID}`)
    } catch (err) {
        console.log(err);
    }

    return
}




export async function deleteUser(contract: Contract, email: string): Promise<boolean> {
    console.log('\n--> Submit Transaction: Delete User, removes a user from the system');

    try {
        await contract.submitTransaction(
            'deleteUser',
            email,
        )

        console.log("Deleted User")
        return true;
    } catch (err: any) {
        console.log(err)
    }

    return false;
}






export async function userExists(contract: Contract, email: string): Promise<boolean> {
    console.log('\n--> Evaluate Transaction: User Exists, checks whether a user exists with the email provided.');

    try {
        await contract.evaluateTransaction(
            "userExists",
            email
        )

        console.log("Exists")
        return true;
    }
    catch (err) {
        console.log(err)
    }

    return false
}



export async function findByID(contract: Contract, userID: string): Promise<User | undefined> {
    console.log('\n--> Evaluate Transaction: Find User By ID, checks whether a user exists with the id provided and return the user.')

    try {
        const resultBytes = await contract.evaluateTransaction(
            "findByID",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const user: User = JSON.parse(resultJson);
        console.log(user);
        return user
    }
    catch (err) {
        console.log(err);
    }

    return undefined;
}




export async function changePassword(contract: Contract, email: string, newPassword: string): Promise<void> {
    console.log('\n--> Submit Transaction: Change Password');

    try {
        await contract.submitTransaction(
            "changePassword",
            email,
            newPassword
        )

        console.log("Password Changed")
    }
    catch (err) {
        console.log(err)
    }

    return
}