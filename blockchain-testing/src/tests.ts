/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import { connect, hash, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
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
import { createNewUser, loginUser, userExists, findByID, changePassword, deleteUser } from './contractFunctions/userContractFunctions';
import { createExpenseCategory, deleteExpenseCategory, getExpenseCategoryByID, listExpenseCategoriesByUser, updateExpenseCategory } from './contractFunctions/expenseCategoryContractFunctions';
import { createExpense, updateExpense, listExpensesByUser, getExpenseByID, deleteExpense } from './contractFunctions/expenseContractFunctions';
import { createIncome, updateIncome, listIncomesByUser, getIncomeByID, deleteIncome } from './contractFunctions/incomeContractFunctions';
import { createGoal, updateGoal, listGoalsByUser, getGoalByID, deleteGoal } from './contractFunctions/goalContractFunctions';
import { createRecurringExpense, updateRecurringExpense, listRecurringExpensesByUser, getRecurringExpenseByID, listAllRecurringExpenses, deleteRecurringExpense } from './contractFunctions/recurringExpenseContractFunctions';
import { createRecurringIncome, updateRecurringIncome, listRecurringIncomesByUser, getRecurringIncomeByID, listAllRecurringIncomes, deleteRecurringIncome } from './contractFunctions/recurringIncomeContractFunctions';


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



const userID = crypto.randomUUID().toString();
const brr = new BasicRecurrenceRule(Frequency.Daily, 1, new Date(), new Date());
const expenseCategory = new ExpenseCategory(userID, 'ec', 250, brr)
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
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
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



        await createNewUser(userContract, userID, "123", "t", '1/1/2020');

        await loginUser(userContract, "123", "t");

        await userExists(userContract, "123");

        await findByID(userContract, userID);

        await changePassword(userContract, "123", "AnActualPassword")



        await createExpenseCategory(expenseCategoryContract, expenseCategory);

        expenseCategory.monthlyBudget = 300;
        await updateExpenseCategory(expenseCategoryContract, expenseCategory)

        await listExpenseCategoriesByUser(expenseCategoryContract, userID)

        await getExpenseCategoryByID(expenseCategoryContract, expenseCategory.getUserID(), expenseCategory.getID());

        await createExpense(expenseContract, expense);

        expense.amount = 100
        await updateExpense(expenseContract, expense)

        await listExpensesByUser(expenseContract, userID);

        await getExpenseByID(expenseContract, userID, expense.getID())



        await createIncome(incomeContract, income);

        income.amount = 100;
        await updateIncome(incomeContract, income);

        await listIncomesByUser(incomeContract, userID)

        await getIncomeByID(incomeContract, userID, income.getID())




        await createGoal(goalContract, goal)

        await updateGoal(goalContract, userID, goal.getID(), 500);

        await listGoalsByUser(goalContract, userID);

        await getGoalByID(goalContract, userID, goal.getID());


        await createRecurringExpense(recurringExpenseContract, recurringExpense);

        recurringExpense.amount = 1000
        await updateRecurringExpense(recurringExpenseContract, recurringExpense);

        await listRecurringExpensesByUser(recurringExpenseContract, userID);

        await getRecurringExpenseByID(recurringExpenseContract, userID, recurringExpense.getID());

        await listAllRecurringExpenses(recurringExpenseContract);





        await createRecurringIncome(recurringIncomeContract, recurringIncome);

        recurringIncome.amount = 10000;
        await updateRecurringIncome(recurringIncomeContract, recurringIncome);

        await listRecurringIncomesByUser(recurringIncomeContract, userID);

        await getRecurringIncomeByID(recurringIncomeContract, userID, recurringIncome.getID());

        await listAllRecurringIncomes(recurringIncomeContract);




        await deleteRecurringIncome(recurringIncomeContract, userID, recurringIncome.getID())

        await deleteRecurringExpense(recurringExpenseContract, userID, recurringExpense.getID());

        await deleteGoal(goalContract, userID, goal.getID())

        await deleteIncome(incomeContract, userID, income.getID())

        await deleteExpense(expenseContract, userID, expense.getID())

        await deleteExpenseCategory(expenseCategoryContract, userID, expenseCategory.getID())

        await deleteUser(userContract, "123");

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