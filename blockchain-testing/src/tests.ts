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
import { TextDecoder } from 'util';
import dotenv from "dotenv";

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
const utf8Decoder = new TextDecoder();

async function main(): Promise<void> {
    displayInputParameters();

    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        hash: hash.sha256,
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
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

        const userID = crypto.randomUUID().toString();
        const brr = new BasicRecurrenceRule(Frequency.Daily, 1, new Date(), new Date());
        const expenseCategory = new ExpenseCategory(userID, 'ec', 250, brr)
        const expense = new Expense(userID, "title", 50, new Date(), "", expenseCategory.getID());
        const income = new Income(userID, "title", 500, new Date(), "");
        const goal = new Goal("title", userID, "sajhvdjahsvd", 1000, new Date(), GoalStatus.Active);



        const recurringExpense = new RecurringExpense(userID, "title", 50, new Date(), "", expenseCategory.getID(), brr);
        const recurringIncome = new RecurringIncome(userID, "title", 50, new Date(), "", brr);



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
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`userContractName:  ${userContractName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certDirectoryPath: ${certDirectoryPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
}





async function createNewUser(contract: Contract, id: string, email: string, password: string, date: string): Promise<void> {
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




async function loginUser(contract: Contract, email: string, password: string): Promise<void> {
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




async function deleteUser(contract: Contract, email: string): Promise<boolean> {
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






async function userExists(contract: Contract, email: string): Promise<boolean> {
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



async function findByID(contract: Contract, userID: string): Promise<User | undefined> {
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




async function changePassword(contract: Contract, email: string, newPassword: string): Promise<void> {
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









async function createExpenseCategory(contract: Contract, ec: ExpenseCategory): Promise<void> {
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





async function updateExpenseCategory(contract: Contract, ec: ExpenseCategory): Promise<void> {
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




async function listExpenseCategoriesByUser(contract: Contract, userID: string): Promise<ExpenseCategory[]> {
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






async function getExpenseCategoryByID(contract: Contract, userID: string, id: string): Promise<ExpenseCategory | undefined> {
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




async function deleteExpenseCategory(contract: Contract, userID: string, id: string): Promise<boolean> {
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




async function createExpense(contract: Contract, e: Expense): Promise<void> {
    console.log('\n--> Submit Transaction: Create Expense,');

    try {
        await contract.submitTransaction(
            "createExpense",
            JSON.stringify(e.toJSON())
        )

        console.log("Created Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


async function updateExpense(contract: Contract, e: Expense) {
    console.log('\n--> Submit Transaction: Update Expense,');

    try {
        await contract.submitTransaction(
            "updateExpense",
            JSON.stringify(e.toJSON())
        )

        console.log("Updated Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


async function deleteExpense(contract: Contract, userID: string, expenseID: string) {
    console.log('\n--> Submit Transaction: Delete Expense,');

    try {
        await contract.submitTransaction(
            "deleteExpense",
            userID,
            expenseID
        )

        console.log("Deleted Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


async function listExpensesByUser(contract: Contract, userID: string): Promise<Expense[]> {
    console.log('\n--> Evaluate Transaction: List Expenses By User,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listExpensesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const expenses: Expense[] = result.expenses;

        console.log(expenses)
        return expenses
    } catch (err) {
        console.log("Failed To Get Expenses")
        console.log(err)
    }

    return [];
}


async function getExpenseByID(contract: Contract, userID: string, id: string): Promise<Expense | undefined> {
    console.log('\n--> Evaluate Transaction: Find Expense By ID,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "getExpenseByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(result)
        return result;
    } catch (err) {
        console.log("Failed To Get Expense");
        console.log(err)
    }

    return undefined;
}




async function createIncome(contract: Contract, i: Income): Promise<void> {
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

async function updateIncome(contract: Contract, i: Income) {
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


async function deleteIncome(contract: Contract, userID: string, incomeID: string) {
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




async function listIncomesByUser(contract: Contract, userID: string): Promise<Income[]> {
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


async function getIncomeByID(contract: Contract, userID: string, id: string): Promise<Income | undefined> {
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





async function createGoal(contract: Contract, i: Goal): Promise<void> {
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





async function updateGoal(contract: Contract, userID: string, goalID: string, current: number) {
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


async function deleteGoal(contract: Contract, userID: string, goalID: string) {
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












async function listGoalsByUser(contract: Contract, userID: string): Promise<Goal[]> {
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


async function getGoalByID(contract: Contract, userID: string, id: string): Promise<Goal | undefined> {
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




































async function createRecurringExpense(contract: Contract, e: RecurringExpense): Promise<void> {
    console.log('\n--> Submit Transaction: Create Recurring Expense,');

    try {
        await contract.submitTransaction(
            "createRecurringExpense",
            JSON.stringify(e.toJSON())
        )

        console.log("Created Recurring Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


async function updateRecurringExpense(contract: Contract, e: RecurringExpense) {
    console.log('\n--> Submit Transaction: Update Recurring Expense,');

    try {
        await contract.submitTransaction(
            "updateRecurringExpense",
            JSON.stringify(e.toJSON())
        )

        console.log("Updated Recurring Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


async function deleteRecurringExpense(contract: Contract, userID: string, expenseID: string) {
    console.log('\n--> Submit Transaction: Delete Recurring Expense,');

    try {
        await contract.submitTransaction(
            "deleteRecurringExpense",
            userID,
            expenseID
        )

        console.log("Deleted Recurring Expense")
    } catch (err: any) {
        console.log(err)
    }

    return
}


async function listRecurringExpensesByUser(contract: Contract, userID: string): Promise<RecurringExpense[]> {
    console.log('\n--> Evaluate Transaction: List Recurring Expenses By User,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listRecurringExpensesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const recurringExpenses: RecurringExpense[] = result.recurringExpenses;

        console.log(recurringExpenses)
        return recurringExpenses
    } catch (err) {
        console.log("Failed To Get Recurring Expenses")
        console.log(err)
    }

    return [];
}


async function getRecurringExpenseByID(contract: Contract, userID: string, id: string): Promise<RecurringExpense | undefined> {
    console.log('\n--> Evaluate Transaction: Find Recurring Expense By ID,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "getRecurringExpenseByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(result)
        return result;
    } catch (err) {
        console.log("Failed To Get Recurring Expense");
        console.log(err)
    }

    return undefined;
}















































async function createRecurringIncome(contract: Contract, e: RecurringIncome): Promise<void> {
    console.log('\n--> Submit Transaction: Create Recurring Income,');

    try {
        await contract.submitTransaction(
            "createRecurringIncome",
            JSON.stringify(e.toJSON())
        )

        console.log("Created Recurring Income")
    } catch (err: any) {
        console.log(err)
    }

    return
}


async function updateRecurringIncome(contract: Contract, e: RecurringIncome) {
    console.log('\n--> Submit Transaction: Update Recurring Income,');

    try {
        await contract.submitTransaction(
            "updateRecurringIncome",
            JSON.stringify(e.toJSON())
        )

        console.log("Updated Recurring Income")
    } catch (err: any) {
        console.log(err)
    }

    return
}


async function deleteRecurringIncome(contract: Contract, userID: string, incomeID: string) {
    console.log('\n--> Submit Transaction: Delete Recurring Income,');

    try {
        await contract.submitTransaction(
            "deleteRecurringIncome",
            userID,
            incomeID,
        )

        console.log("Deleted Recurring Income")
    } catch (err: any) {
        console.log(err)
    }

    return
}


async function listRecurringIncomesByUser(contract: Contract, userID: string): Promise<RecurringIncome[]> {
    console.log('\n--> Evaluate Transaction: List Recurring Incomes By User,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listRecurringIncomesByUser",
            userID,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const recurringIncomes: RecurringIncome[] = result.recurringIncomes;

        console.log(recurringIncomes)
        return recurringIncomes
    } catch (err: any) {
        console.log("Failed To Get Recurring Incomes")
        console.log(err)
    }

    return [];
}


async function getRecurringIncomeByID(contract: Contract, userID: string, id: string): Promise<RecurringIncome | undefined> {
    console.log('\n--> Evaluate Transaction: Find Recurring Income By ID,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "getRecurringIncomeByID",
            userID,
            id,
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(result)
        return result;
    } catch (err) {
        console.log("Failed To Get Recurring Income");
        console.log(err)
    }

    return undefined;
}




async function listAllRecurringExpenses(contract: Contract): Promise<RecurringExpense[]> {
    console.log('\n--> Evaluate Transaction: List All Recurring Expenses,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listAllRecurringExpenses",
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const recurringExpenses: RecurringExpense[] = result.recurringExpenses;
        console.log(recurringExpenses);
        return recurringExpenses
    } catch (err) {
        console.log("Failed To Get All Recurring Expenses")
        console.log(err)
    }

    return [];
}





async function listAllRecurringIncomes(contract: Contract): Promise<RecurringIncome[]> {
    console.log('\n--> Evaluate Transaction: List All Recurring Incomes,');

    try {
        const resultBytes = await contract.evaluateTransaction(
            "listAllRecurringIncomes",
        )

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        const recurringIncomes: RecurringIncome[] = result.recurringIncomes;
        console.log(recurringIncomes);
        return recurringIncomes
    } catch (err) {
        console.log("Failed To Get All Recurring Incomes")
        console.log(err)
    }

    return [];
}












enum Frequency {
    Daily = "Daily",
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Yearly = 'Yearly'
}




abstract class RecurrenceRule {
    frequency: Frequency;
    interval: number;
    startDate: Date;
    nextTriggerDate: Date;
    endDate?: Date;

    constructor(frequency: Frequency, interval: number, startDate: Date, endDate?: Date) {
        this.frequency = frequency;
        this.interval = interval;
        this.startDate = startDate;
        this.endDate = endDate;

        this.nextTriggerDate = new Date(Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
        ));
    }

    public shouldTrigger(): boolean {
        const now = new Date();
        return now >= this.nextTriggerDate;
    }

    public computeNextTriggerDate(): Date {
        const now = new Date(Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth(),
            new Date().getUTCDate(),
        ));

        while (this.nextTriggerDate <= now) {
            switch (this.frequency) {
                case Frequency.Daily:
                    this.nextTriggerDate.setUTCDate(this.nextTriggerDate.getUTCDate() + this.interval);
                    break;
                case Frequency.Weekly:
                    this.nextTriggerDate.setUTCDate(this.nextTriggerDate.getUTCDate() + this.interval * 7);
                    break;
                case Frequency.Monthly:
                    this.nextTriggerDate.setUTCMonth(this.nextTriggerDate.getUTCMonth() + this.interval);
                    break;
                case Frequency.Yearly:
                    this.nextTriggerDate.setUTCFullYear(this.nextTriggerDate.getUTCFullYear() + this.interval);
                    break;
                default:
                    throw new Error("Unsupported frequency");
            }

            if (this.endDate && this.nextTriggerDate > this.endDate) {
                throw new Error("Next trigger date exceeds end date");
            }
        }

        return this.nextTriggerDate;
    }

    public toJSON() {
        return {
            frequency: this.frequency,
            interval: this.interval,
            startDate: this.startDate,
            nextTriggerDate: this.nextTriggerDate,
            endDate: this.endDate,
        }
    }
}






class BasicRecurrenceRule extends RecurrenceRule {
    constructor(frequency: Frequency, interval: number, startDate: Date, endDate?: Date) {
        super(frequency, interval, startDate, endDate);
    }

    public toJSON() {
        return {
            frequency: this.frequency,
            interval: this.interval,
            startDate: this.startDate,
            nextTriggerDate: this.nextTriggerDate,
            endDate: this.endDate,
        }
    }
}








class ExpenseCategory {
    private id: string;
    private userID: string;
    name: string;
    monthlyBudget: number;
    recurrenceRule: BasicRecurrenceRule;

    constructor(userID: string, name: string, monthlyBudget: number, recurrenceRule: BasicRecurrenceRule) {
        this.id = crypto.randomUUID().toString();
        this.userID = userID;
        this.name = name;
        this.monthlyBudget = monthlyBudget;
        this.recurrenceRule = recurrenceRule;
    }

    getID(): string {
        return this.id;
    }

    getUserID(): string {
        return this.userID;
    }

    calculateBudgetUsed(currentSpending: number): number {
        return currentSpending / this.monthlyBudget;
    }

    shouldResetBudget(): boolean {
        if (this.recurrenceRule) {
            return this.recurrenceRule.shouldTrigger();
        }
        return false;
    }

    updateBudgetCycle(): void {
        if (this.recurrenceRule && this.recurrenceRule.shouldTrigger()) {
            this.recurrenceRule.nextTriggerDate = this.recurrenceRule.computeNextTriggerDate();
        }
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            name: this.name,
            monthlyBudget: this.monthlyBudget,
            recurrenceRule: this.recurrenceRule,
        };
    }
}






class Expense implements Transaction {
    private id: string;
    private userID: string;
    title: string;
    amount: number;
    date: Date;
    notes: string;
    categoryID: string;
    receipt?: string;

    constructor(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, receipt?: string) {
        this.id = crypto.randomUUID().toString();
        this.userID = userID;
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.notes = notes;
        this.categoryID = categoryID;
        this.receipt = receipt;
    }

    getID(): string {
        return this.id;
    }

    getUserID(): string {
        return this.userID;
    }

    getPageURL(): string {
        return "/viewExpenseDetailsPage/" + this.id;
    }

    getEditURL(): string {
        return "/editExpensePage/" + this.id;
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            title: this.title,
            amount: this.amount,
            date: this.date,
            notes: this.notes,
            categoryID: this.categoryID,
            receipt: this.receipt,
        }
    }
}



interface Transaction {
    title: string
    date: Date
    amount: number
    notes: string
    getPageURL(): string
    getEditURL(): string
}

















class Income implements Transaction {
    private id: string;
    private userID: string;
    title: string;
    amount: number;
    date: Date;
    notes: string;

    constructor(userID: string, title: string, amount: number, date: Date, notes: string) {
        this.id = crypto.randomUUID().toString();
        this.userID = userID;
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.notes = notes;
    }

    getID(): string {
        return this.id;
    }

    getUserID(): string {
        return this.userID;
    }

    getPageURL(): string {
        return "/viewIncomeDetailsPage/" + this.id;
    }

    getEditURL(): string {
        return "/editIncomePage/" + this.id;
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            title: this.title,
            amount: this.amount,
            date: this.date,
            notes: this.notes,
        }
    }
}







enum GoalStatus {
    Active = "Active",
    Completed = "Completed",
    Archived = "Archived",
}

class Goal {
    private id: string;
    private userID: string;
    title: string;
    description: string;
    target: number;
    targetDate: Date;
    current: number;
    status: GoalStatus;

    constructor(title: string, userID: string, description: string, target: number, targetDate: Date, status: GoalStatus) {
        this.id = crypto.randomUUID().toString();
        this.userID = userID;
        this.title = title;
        this.description = description;
        this.target = target;
        this.targetDate = targetDate;
        this.current = 0;
        this.status = status;
    }

    getID(): string {
        return this.id;
    }

    getUserID(): string {
        return this.userID;
    }

    isTimeUp(): boolean {
        return new Date() >= this.targetDate;
    }

    updateCurrent(figure: number): void {
        this.current += figure;
    }

    calculateProgress(): number {
        return this.current / this.target;
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            title: this.title,
            description: this.description,
            target: this.target,
            targetDate: this.targetDate,
            current: this.current,
            status: this.status,
        }
    }
}








interface RecurringTransaction extends Transaction {
    recurrenceRule: RecurrenceRule;
}






class RecurringIncome extends Income implements RecurringTransaction {
    recurrenceRule: RecurrenceRule;

    constructor(userID: string, title: string, amount: number, date: Date, notes: string, recurrenceRule: RecurrenceRule) {
        super(userID, title, amount, date, notes);
        this.recurrenceRule = recurrenceRule;
    }

    getEditURL(): string {
        return "/editRecurringIncomePage/" + this.getID();
    }

    getPageURL(): string {
        return "/viewRecurringIncomeDetailsPage/" + this.getID();
    }

    public toJSON() {
        let partialResult = super.toJSON();
        return {
            ...partialResult,
            recurrenceRule: this.recurrenceRule,
        };
    }
}





export default class RecurringExpense extends Expense implements RecurringTransaction {
    recurrenceRule: RecurrenceRule;

    constructor(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule) {
        super(userID, title, amount, date, notes, categoryID, "");
        this.recurrenceRule = recurrenceRule;
    }

    getPageURL(): string {
        return "/viewRecurringExpenseDetailsPage/" + this.getID();
    }

    getEditURL(): string {
        return "/editRecurringExpensePage/" + this.getID();
    }

    public toJSON() {
        let partialResult = super.toJSON();
        return {
            ...partialResult,
            recurrenceRule: this.recurrenceRule,
        };
    }
}




class User {
    private id: string;
    private username: string;
    private password: string;
    private dateJoined: Date;
    private status: UserStatus;

    constructor(username: string, password: string) {
        this.id = crypto.randomUUID().toString();
        this.username = username;
        this.password = password;  // In real systems, hash this!
        this.dateJoined = new Date();
        this.status = UserStatus.PENDING;
    }

    public getUserID(): string { return this.id; }
    public getEmail(): string { return this.username; }
    public getPassword(): string { return this.password; }
    public getDateJoined(): Date { return this.dateJoined; }
    public setUserStatus(newStatus: UserStatus): void { this.status = newStatus; }
    public getUserStatus(): UserStatus { return this.status; }
}

enum UserStatus {
    VERIFIED = "VERIFIED",
    PENDING = "PENDING"
}