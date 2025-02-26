import { Contract } from "@hyperledger/fabric-gateway";
import ExpenseCategory from "../models/core/ExpenseCategory";
import RecurrenceRule from "../models/recurrenceModels/RecurrenceRule";
import { TextDecoder } from 'util';


const utf8Decoder = new TextDecoder();



class ExpenseCategoryService {
    private expenseCategoryContract: Contract;

    constructor(expenseCategoryContract: Contract) {
        this.expenseCategoryContract = expenseCategoryContract;
    }

    public async addExpenseCategory(userID: string, name: string, monthlyBudget: number, recurrenceRule: RecurrenceRule): Promise<boolean> {
        const category = new ExpenseCategory(userID, name, monthlyBudget, recurrenceRule);
        try {
            await this.expenseCategoryContract.submitTransaction(
                "createExpenseCategory",
                JSON.stringify(category.toJSON())
            )

            return true;
        } catch (err) {
            console.log(err);
        }

        return false;
    }

    public async updateExpenseCategory(id: string, userID: string, name: string, monthlyBudget: number, recurrenceRule: RecurrenceRule): Promise<boolean> {

        try {
            const category = await this.findByID(id, userID);
            if (!category) {
                throw new Error("Category not found");
            }

            category.name = name;
            category.monthlyBudget = monthlyBudget;
            category.recurrenceRule = recurrenceRule;

            await this.expenseCategoryContract.submitTransaction(
                "updateExpenseCategory",
                JSON.stringify(category.toJSON()),
            )

            return true
        } catch (err) {
            console.log(err);
        }

        return false;
    }

    public async deleteExpenseCategory(id: string, userID: string): Promise<boolean> {
        try {
            await this.expenseCategoryContract.submitTransaction(
                "deleteExpenseCategory",
                userID,
                id,
            )

            return true;
        } catch (err) {
            console.log(err);
        }

        return false;
    }

    public async getAllCategoriesByUser(userID: string): Promise<ExpenseCategory[]> {
        try {
            const resultBytes = await this.expenseCategoryContract.evaluateTransaction(
                "listExpenseCategoriesByUser",
                userID,
            )

            const resultJson = utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            const categories: ExpenseCategory[] = result.categories;
            return categories
        } catch (err) {
            console.log(err);
        }

        return [];
    }

    public async findByID(id: string, userID: string): Promise<ExpenseCategory | undefined> {
        try {
            const resultBytes = await this.expenseCategoryContract.evaluateTransaction(
                "getExpenseCategoryByID",
                userID,
                id,
            )

            const resultJson = utf8Decoder.decode(resultBytes);
            const result: ExpenseCategory = JSON.parse(resultJson);
            return result;
        } catch (err) {
            console.log(err)
        }

        return undefined;
    }

}

export default ExpenseCategoryService;
