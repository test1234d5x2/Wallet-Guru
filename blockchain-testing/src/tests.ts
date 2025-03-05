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
import { createExpenseCategory, deleteExpenseCategory, getExpenseCategoryByID, listExpenseCategoriesByUser, updateExpenseCategory } from './contractFunctions/expenseCategoryContractFunctions';
import { createExpense, deleteExpense, getExpenseByID, listExpensesByUser, updateExpense } from './contractFunctions/expenseContractFunctions';
import { createIncome, deleteIncome, getIncomeByID, listIncomesByUser, updateIncome } from './contractFunctions/incomeContractFunctions';
import { createGoal, deleteGoal, getGoalByID, listGoalsByUser, updateGoal } from './contractFunctions/goalContractFunctions';
import { createRecurringExpense, deleteRecurringExpense, getRecurringExpenseByID, listRecurringExpensesByUser, updateRecurringExpense } from './contractFunctions/recurringExpenseContractFunctions';
import { createRecurringIncome, deleteRecurringIncome, getRecurringIncomeByID, listRecurringIncomesByUser, updateRecurringIncome } from './contractFunctions/recurringIncomeContractFunctions';
import { testUserDetails } from './tests/userTests';
import { testExpenseCategoryDetails } from './tests/expenseCategoryTests';
import { testExpenseDetails } from './tests/expenseTests';
import { testIncomeDetails } from './tests/incomeTests';
import { testGoalDetails } from './tests/goalTests';
import { testRecurrenceExpenseDetails } from './tests/recurringExpenseTests';
import { testRecurringIncomeDetails } from './tests/recurringIncomeTests';


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



let numberOfTests = 0;
let passedCount = 0;



async function testSuite(): Promise<void> {
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
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Create User:")
            if (testUserDetails(retrievedUser, user)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        const loginUserID = await loginUser(userContract, user.getEmail(), user.getPassword());
        if (!loginUserID) {
            console.log("************* loginUser Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Login User:")
            if (loginUserID === user.getUserID()) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++
            console.log()
        }

        const userExistsValue = await userExists(userContract, user.getEmail());
        console.log()
        console.log("Testing User Exists:")
        if (userExistsValue) {
            console.log("Result: Pass")
            passedCount++
        }
        else console.log("Result: Fail")
        numberOfTests++
        console.log()


        const newPasswordValue = "AnActualPassword";
        user.setPassword(newPasswordValue);
        await changePassword(userContract, user.getEmail(), "AnActualPassword")
        retrievedUser = await findByID(userContract, userID);
        if (!retrievedUser) {
            console.log("************* findByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Change Password:")
            if (testUserDetails(retrievedUser, user)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }








        await createExpenseCategory(expenseCategoryContract, expenseCategory);

        let retrievedExpenseCategory = await getExpenseCategoryByID(expenseCategoryContract, user.getUserID(), expenseCategory.getID());
        if (!retrievedExpenseCategory) {
            console.log("************* getExpenseCategoryByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Create Expense Category:")
            if (testExpenseCategoryDetails(retrievedExpenseCategory, expenseCategory)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        expenseCategory.monthlyBudget = 300;
        await updateExpenseCategory(expenseCategoryContract, expenseCategory)
        retrievedExpenseCategory = await getExpenseCategoryByID(expenseCategoryContract, user.getUserID(), expenseCategory.getID());
        if (!retrievedExpenseCategory) {
            console.log("************* getExpenseCategoryByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Update Expense Category:")
            if (testExpenseCategoryDetails(retrievedExpenseCategory, expenseCategory)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        let a = await listExpenseCategoriesByUser(expenseCategoryContract, userID)
        if (a.length <= 0) {
            console.log("************* listExpenseCategoriesByUser Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing List Expense Category By User:")
            if (testExpenseCategoryDetails(a[0] as ExpenseCategory, expenseCategory)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }






        await createExpense(expenseContract, expense);
        let retrievedExpense = await getExpenseByID(expenseContract, expense.getUserID(), expense.getID());
        if (!retrievedExpense) {
            console.log("************* getExpenseByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract)
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Create Expense:")
            if (testExpenseDetails(retrievedExpense, expense)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }


        expense.amount = 100
        await updateExpense(expenseContract, expense)
        retrievedExpense = await getExpenseByID(expenseContract, expense.getUserID(), expense.getID());
        if (!retrievedExpense) {
            console.log("************* getExpenseByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract)
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Update Expense:")
            if (testExpenseDetails(retrievedExpense, expense)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        let expensesList = await listExpensesByUser(expenseContract, userID);
        if (expensesList.length === 0) {
            console.log("************* listExpensesByUser Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing List Expense By User:")
            if (testExpenseDetails(expensesList[0] as Expense, expense)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }








        await createIncome(incomeContract, income);
        let retrievedIncome = await getIncomeByID(incomeContract, userID, income.getID())
        if (!retrievedIncome) {
            console.log("************* getIncomeByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract)
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Create Income:")
            if (testIncomeDetails(retrievedIncome, income)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        income.amount = 100;
        await updateIncome(incomeContract, income);
        if (!retrievedIncome) {
            console.log("************* getIncomeByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract)
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Update Income:")
            if (testIncomeDetails(retrievedIncome, income)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }


        let incomesList = await listIncomesByUser(incomeContract, userID)
        if (incomesList.length === 0) {
            console.log("************* listIncomesByUser Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing List Income By User:")
            if (testIncomeDetails(incomesList[0] as Income, income)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }








        await createGoal(goalContract, goal)
        let retrievedGoal = await getGoalByID(goalContract, userID, goal.getID())
        if (!retrievedGoal) {
            console.log("************* getGoalByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract)
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Create Goal:")
            if (testGoalDetails(retrievedGoal, goal)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        goal.updateCurrent(500)
        await updateGoal(goalContract, userID, goal.getID(), 500);
        retrievedGoal = await getGoalByID(goalContract, userID, goal.getID())
        if (!retrievedGoal) {
            console.log("************* getGoalByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract)
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Update Goal:")
            if (testGoalDetails(retrievedGoal, goal)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        let goalsList = await listGoalsByUser(goalContract, userID);
        if (goalsList.length === 0) {
            console.log("************* listGoalsByUser Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing List Goals By User:")
            if (testGoalDetails(goalsList[0] as Goal, goal)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }







        await createRecurringExpense(recurringExpenseContract, recurringExpense);
        let retrievedRecurringExpense = await getRecurringExpenseByID(recurringExpenseContract, userID, recurringExpense.getID())
        if (!retrievedRecurringExpense) {
            console.log("************* getRecurringExpenseByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract)
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Create Recurring Expense:")
            if (testRecurrenceExpenseDetails(retrievedRecurringExpense, recurringExpense)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        recurringExpense.amount = 1000
        await updateRecurringExpense(recurringExpenseContract, recurringExpense);
        retrievedRecurringExpense = await getRecurringExpenseByID(recurringExpenseContract, userID, recurringExpense.getID())
        if (!retrievedRecurringExpense) {
            console.log("************* getRecurringExpenseByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract)
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Update Recurring Expense:")
            if (testRecurrenceExpenseDetails(retrievedRecurringExpense, recurringExpense)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        let recurringExpenseList = await listRecurringExpensesByUser(recurringExpenseContract, userID);
        if (recurringExpenseList.length === 0) {
            console.log("************* listRecurringExpensesByUser Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing List Recurring Expenses By User:")
            if (testRecurrenceExpenseDetails(recurringExpenseList[0] as RecurringExpense, recurringExpense)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }





        await createRecurringIncome(recurringIncomeContract, recurringIncome);
        let retrievedRecurringIncome = await getRecurringIncomeByID(recurringIncomeContract, userID, recurringIncome.getID())
        if (!retrievedRecurringIncome) {
            console.log("************* getRecurringIncomeByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract)
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Create Recurring Income:")
            if (testRecurringIncomeDetails(retrievedRecurringIncome, recurringIncome)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        recurringIncome.amount = 10000;
        await updateRecurringIncome(recurringIncomeContract, recurringIncome);
        retrievedRecurringIncome = await getRecurringIncomeByID(recurringIncomeContract, userID, recurringIncome.getID())
        if (!retrievedRecurringIncome) {
            console.log("************* getRecurringIncomeByID Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract)
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing Update Recurring Income:")
            if (testRecurringIncomeDetails(retrievedRecurringIncome, recurringIncome)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }

        let recurringIncomeList = await listRecurringIncomesByUser(recurringIncomeContract, userID);
        if(recurringIncomeList.length === 0) {
            console.log("************* listRecurringExpensesByUser Failed *************")
            await bringDown(userContract, expenseContract, expenseCategoryContract, incomeContract, goalContract, recurringIncomeContract, recurringExpenseContract);
            numberOfTests++
            displayResults(numberOfTests, passedCount)
            return
        }
        else {
            console.log()
            console.log("Testing List Recurring Incomes By User:")
            if (testRecurringIncomeDetails(recurringIncomeList[0] as RecurringIncome, recurringIncome)) {
                passedCount++
                console.log("Result: Pass")
            }
            else console.log("Result: Fail")
            numberOfTests++;
            console.log()
        }





        const recurringIncomeDeleted = await deleteRecurringIncome(recurringIncomeContract, userID, recurringIncome.getID())
        console.log()
        console.log("Testing Recurring Income Deleted:")
        if (recurringIncomeDeleted) {
            passedCount++
            console.log("Result: Pass")
        }
        else console.log("Result: Fail")
        numberOfTests++
        console.log()



        const recurringExpenseDeleted = await deleteRecurringExpense(recurringExpenseContract, userID, recurringExpense.getID());
        console.log()
        console.log("Testing Recurring Expense Deleted:")
        if (recurringExpenseDeleted) {
            passedCount++
            console.log("Result: Pass")
        }
        else console.log("Result: Fail")
        numberOfTests++
        console.log()


        const goalDeleted = await deleteGoal(goalContract, userID, goal.getID())
        console.log()
        console.log("Testing Goal Deleted:")
        if (goalDeleted) {
            passedCount++
            console.log("Result: Pass")
        }
        else console.log("Result: Fail")
        numberOfTests++
        console.log()


        const incomeDelete = await deleteIncome(incomeContract, userID, income.getID())
        console.log()
        console.log("Testing Income Deleted:")
        if (incomeDelete) {
            passedCount++
            console.log("Result: Pass")
        }
        else console.log("Result: Fail")
        numberOfTests++
        console.log()

        const expenseDeleted = await deleteExpense(expenseContract, userID, expense.getID())
        console.log()
        console.log("Testing Expense Deleted:")
        if (expenseDeleted) {
            passedCount++
            console.log("Result: Pass")
        }
        else console.log("Result: Fail")
        numberOfTests++
        console.log()


        const expenseCategoryDeleted = await deleteExpenseCategory(expenseCategoryContract, userID, expenseCategory.getID())
        console.log()
        console.log("Testing Expense Category Deleted:")
        if (expenseCategoryDeleted) {
            passedCount++
            console.log("Result: Pass")
        }
        else console.log("Result: Fail")
        numberOfTests++
        console.log()

        const userDeletedValue = await deleteUser(userContract, user.getEmail());
        console.log()
        console.log("Testing User Deleted:")
        if (userDeletedValue) {
            passedCount++
            console.log("Result: Pass")
        }
        else console.log("Result: Fail")
        numberOfTests++
        console.log()

        displayResults(numberOfTests, passedCount)


    } finally {
        gateway.close();
        client.close();
    }
}

testSuite().catch((error: unknown) => {
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
    await deleteRecurringExpense(recurringExpenseContract, userID, recurringExpense.getID())
    await deleteGoal(goalContract, userID, goal.getID())
    await deleteIncome(incomeContract, userID, income.getID())
    await deleteExpense(expenseContract, userID, expense.getID())
    await deleteExpenseCategory(expenseCategoryContract, userID, expenseCategory.getID())
    await deleteUser(userContract, user.getEmail())
}


function displayResults(numberOfTests: number, passedCount: number) {
    console.log("")
    console.log("Passed Tests:", passedCount)
    console.log("Number of Tests:", numberOfTests)
    console.log()
    return
}