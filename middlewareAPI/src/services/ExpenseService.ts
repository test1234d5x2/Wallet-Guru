import { Contract } from "@hyperledger/fabric-gateway";
import Expense from "../models/core/Expense";
import { TextDecoder } from 'util';



const utf8Decoder = new TextDecoder();


class ExpenseService {
    private expenseContract: Contract;

    constructor(expenseContract: Contract) {
        this.expenseContract = expenseContract;
    }

    public async addExpense(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, receipt?: string): Promise<boolean> {
        const expense = new Expense(userID, title, amount, date, notes, categoryID, receipt);

        try {
            await this.expenseContract.submitTransaction(
                "createExpense",
                JSON.stringify(expense.toJSON())
            )

            return true;
        } catch (err: any) {
            console.log(err)
        }

        return false;
    }

    public async updateExpense(id: string, userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, receipt?: string): Promise<boolean> {
        try {
            const expense = await this.findByID(id, userID);
            if (!expense) {
                throw new Error(`The expense does not exist`);
            }

            expense.title = title;
            expense.amount = amount;
            expense.date = date;
            expense.notes = notes;
            expense.categoryID = categoryID;
            expense.receipt = receipt || undefined;

            await this.expenseContract.submitTransaction(
                "updateExpense",
                JSON.stringify(expense.toJSON())
            )

            return true;
        } catch (err: any) {
            console.log(err)
        }

        return false;
    }

    public async deleteExpense(id: string, userID: string): Promise<boolean> {
        try {
            await this.expenseContract.submitTransaction(
                "deleteExpense",
                userID,
                id
            )

            return true;
        } catch (err: any) {
            console.log(err)
        }

        return false;
    }

    public async getAllExpensesByUser(userID: string): Promise<Expense[]> {
        try {
            const resultBytes = await this.expenseContract.evaluateTransaction(
                "listExpensesByUser",
                userID,
            )

            const resultJson = utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            const expenses: Expense[] = result.expenses;

            return expenses
        } catch (err) {
            console.log(err)
        }

        return [];
    }

    public async findByID(id: string, userID: string): Promise<Expense | undefined> {
        try {
            const resultBytes = await this.expenseContract.evaluateTransaction(
                "getExpenseByID",
                userID,
                id,
            )

            const resultJson = utf8Decoder.decode(resultBytes);
            const result: Expense = JSON.parse(resultJson);
            return result;
        } catch (err) {
            console.log(err)
        }

        return undefined;
    }
}

export default ExpenseService;
