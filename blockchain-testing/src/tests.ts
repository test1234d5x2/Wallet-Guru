/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import { connect, Contract, hash, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import dotenv from "dotenv";
import Expense from './models/core/Expense';
import ExpenseCategory from './models/core/ExpenseCategory';
import Goal from './models/core/Goal';
import Income from './models/core/Income';
import BasicRecurrenceRule from './models/recurrenceModels/BasicRecurrenceRule';
import RecurringExpense from './models/recurrenceModels/RecurringExpense';
import RecurringIncome from './models/recurrenceModels/RecurringIncome';
import Frequency from './enums/Frequency';
import GoalStatus from './enums/GoalStatus';
import User from './models/core/User';
import UserStatus from './enums/UserStatus';
import { createNewUser, findByID, deleteUser, loginUser, userExists, changePassword } from './contractFunctions/userContractFunctions';
import { createExpenseCategory, deleteExpenseCategory, getExpenseCategoryByID } from './contractFunctions/expenseCategoryContractFunctions';
import { deleteExpense } from './contractFunctions/expenseContractFunctions';
import { deleteIncome } from './contractFunctions/incomeContractFunctions';
import { deleteGoal } from './contractFunctions/goalContractFunctions';
import { deleteRecurringExpense } from './contractFunctions/recurringExpenseContractFunctions';
import { deleteRecurringIncome } from './contractFunctions/recurringIncomeContractFunctions';
import { testUserDetails } from './tests/userTests';
import { testExpenseCategoryDetails } from './tests/expenseCategoryTests';


dotenv.config();


const channelName = envOrDefault('CHANNEL_NAME', '');
const chaincodeName = envOrDefault('CHAINCODE_NAME', '');
const userContractName = "UserContract";
const expenseCategoryContractName = "ExpenseCategoryContract";
const expenseContractName = "ExpenseContract";
const incomeContractName = "IncomeContract";
const goalConractName = "GoalContract";
const recurringExpenseContractName = "RecurringExpenseContract";
const recurringIncomeContractName = "RecurringIncomeContract";
const mspId = envOrDefault('MSP_ID', '');
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', '');
const certDirectoryPath = envOrDefault('CERTIFICATE_DIRECTORY_PATH', '');
const tlsCertPath = envOrDefault('TLS_CERTIFICATE_PATH', '');
const peerEndpoint = envOrDefault('PEER_ENDPOINT', '');
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', '');


const userDate = new Date(Date.UTC(2020, 1, 1))
const userID = crypto.randomUUID().toString();
const user = new User("1234", "t", userID, userDate, UserStatus.PENDING)
const brr = new BasicRecurrenceRule(Frequency.Daily, 1, new Date(), new Date());
const expenseCategory = new ExpenseCategory(userID, 'Bills', 500, brr)
const expense = new Expense(userID, "title", 50, new Date(), "", expenseCategory.getID());
const income = new Income(userID, "title", 500, new Date(), "");
const goal = new Goal("title", userID, "sajhvdjahsvd", 1000, new Date(), GoalStatus.Active);
const recurringExpense = new RecurringExpense(userID, "title", 50, new Date(), "", expenseCategory.getID(), brr);
const recurringIncome = new RecurringIncome(userID, "title", 50, new Date(), "", brr);



async function main(): Promise<void> {
    displayInputParameters();

    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        hash: hash.sha256,
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 };
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 };
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 };
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 };
        },
    });

    try {
        const network = gateway.getNetwork(channelName);

        const userContract = network.getContract(chaincodeName, userContractName);
        const expenseCategoryContract = network.getContract(chaincodeName, expenseCategoryContractName);
        const expenseContract = network.getContract(chaincodeName, expenseContractName);
        const incomeContract = network.getContract(chaincodeName, incomeContractName);
        const goalContract = network.getContract(chaincodeName, goalConractName);
        const recurringExpenseContract = network.getContract(chaincodeName, recurringExpenseContractName);
        const recurringIncomeContract = network.getContract(chaincodeName, recurringIncomeContractName);



        await createNewUser(userContract, user.getUserID(), user.getEmail(), user.getPassword(), user.getDateJoined());



        let retrievedUser = await findByID(userContract, userID);
        if (!retrievedUser) {
            console.log("************* findByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            return
        }
        else {
            console.log()
            console.log("Testing Create User:")
            console.log("Result:", testUserDetails(retrievedUser, user) ? "Pass" : "Fail")
            console.log()
        }

        const loginUserID = await loginUser(userContract, user.getEmail(), user.getPassword());
        if (!loginUserID) {
            console.log("************* loginUser Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            return
        }
        else {
            console.log()
            console.log("Testing Login User:")
            console.log("Result:", loginUserID === user.getUserID() ? "Pass" : "Fail")
            console.log()
        }

        const userExistsValue = await userExists(userContract, user.getEmail());
        console.log()
        console.log("Testing User Exists:")
        console.log("Result:", userExistsValue)
        console.log()


        const newPasswordValue = "AnActualPassword";
        user.setPassword(newPasswordValue);
        await changePassword(userContract, user.getEmail(), "AnActualPassword")
        retrievedUser = await findByID(userContract, userID);
        if (!retrievedUser) {
            console.log("************* findByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            return
        }
        else {
            console.log()
            console.log("Testing Change Password:")
            console.log("Result:", testUserDetails(retrievedUser, user) ? "Pass" : "Fail")
            console.log()
        }





        await createExpenseCategory(expenseCategoryContract, expenseCategory);

        let retrievedExpenseCategory = await getExpenseCategoryByID(expenseCategoryContract, user.getUserID(), expenseCategory.getID());
        if (!retrievedExpenseCategory) {
            console.log("************* getExpenseCategoryByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            return
        }
        else {
            console.log()
            console.log("Testing Create User:")
            console.log("Result:", testExpenseCategoryDetails(retrievedExpenseCategory, expenseCategory) ? "Pass" : "Fail")
            console.log()
        }

        // expenseCategory.monthlyBudget = 300;
        // await updateExpenseCategory(expenseCategoryContract, expenseCategory)

        // await listExpenseCategoriesByUser(expenseCategoryContract, userID)

        // await getExpenseCategoryByID(expenseCategoryContract, expenseCategory.getUserID(), expenseCategory.getID());

        // await createExpense(expenseContract, expense);

        // expense.amount = 100
        // await updateExpense(expenseContract, expense)

        // await listExpensesByUser(expenseContract, userID);

        // await getExpenseByID(expenseContract, userID, expense.getID())



        // await createIncome(incomeContract, income);

        // income.amount = 100;
        // await updateIncome(incomeContract, income);

        // await listIncomesByUser(incomeContract, userID)

        // await getIncomeByID(incomeContract, userID, income.getID())




        // await createGoal(goalContract, goal)

        // await updateGoal(goalContract, userID, goal.getID(), 500);

        // await listGoalsByUser(goalContract, userID);

        // await getGoalByID(goalContract, userID, goal.getID());


        // await createRecurringExpense(recurringExpenseContract, recurringExpense);

        // recurringExpense.amount = 1000
        // await updateRecurringExpense(recurringExpenseContract, recurringExpense);

        // await listRecurringExpensesByUser(recurringExpenseContract, userID);

        // await getRecurringExpenseByID(recurringExpenseContract, userID, recurringExpense.getID());

        // await listAllRecurringExpenses(recurringExpenseContract);





        // await createRecurringIncome(recurringIncomeContract, recurringIncome);

        // recurringIncome.amount = 10000;
        // await updateRecurringIncome(recurringIncomeContract, recurringIncome);

        // await listRecurringIncomesByUser(recurringIncomeContract, userID);

        // await getRecurringIncomeByID(recurringIncomeContract, userID, recurringIncome.getID());

        // await listAllRecurringIncomes(recurringIncomeContract);


        await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);


    } finally {
        gateway.close();
        client.close();
    }
}

main().catch((error: unknown) => {
    console.error('******** FAILED to run the application:', error);
    process.exitCode = 1;
});

async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    if (!peerHostAlias) {
        return new grpc.Client(peerEndpoint, tlsCredentials);
    }
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity(): Promise<Identity> {
    const certPath = await getFirstDirFileName(certDirectoryPath);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function getFirstDirFileName(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    const file = files[0];
    if (!file) {
        throw new Error(`No files in directory: ${dirPath}`);
    }
    return path.join(dirPath, file);
}

async function newSigner(): Promise<Signer> {
    const keyPath = await getFirstDirFileName(keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

function displayInputParameters(): void {
    console.log("channelName:", channelName);
    console.log("chaincodeName:", chaincodeName);
    console.log("userContractName:", userContractName);
    console.log("expenseCategoryContractName:", expenseCategoryContractName);
    console.log("expenseContractName:", expenseContractName);
    console.log("incomeContractName:", incomeContractName);
    console.log("goalConractName:", goalConractName);
    console.log("recurringExpenseContractName:", recurringExpenseContractName);
    console.log("recurringIncomeContractName:", recurringIncomeContractName);
    console.log("mspId:", mspId);
    console.log("keyDirectoryPath:", keyDirectoryPath);
    console.log("certDirectoryPath:", certDirectoryPath);
    console.log("tlsCertPath:", tlsCertPath);
    console.log("peerEndpoint:", peerEndpoint);
    console.log("peerHostAlias:", peerHostAlias);
}


async function bringDown(userContract: Contract, expenseContract: Contract, expenseCategoryContract: Contract, incomeContract: Contract, goalContract: Contract, recurringIncomeContract: Contract, recurringExpenseContract: Contract) {
    await deleteRecurringIncome(recurringIncomeContract, userID, recurringIncome.getID())
    await deleteRecurringExpense(recurringExpenseContract, userID, recurringExpense.getID());
    await deleteGoal(goalContract, userID, goal.getID())
    await deleteIncome(incomeContract, userID, income.getID())
    await deleteExpense(expenseContract, userID, expense.getID())



    const expenseCategoryDeleted = await deleteExpenseCategory(expenseCategoryContract, userID, expenseCategory.getID())
    console.log()
    console.log("Testing Expense Category Deleted:")
    console.log("Result:", expenseCategoryDeleted ? "Pass" : "Fail")
    console.log()


    const userDeletedValue = await deleteUser(userContract, user.getEmail());
    console.log()
    console.log("Testing User Deleted:")
    console.log("Result:", userDeletedValue ? "Pass" : "Fail")
    console.log()
}