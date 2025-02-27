import { Contract } from "@hyperledger/fabric-gateway";
import ExpenseCategory from "../models/core/ExpenseCategory";
import RecurrenceRule from "../models/recurrenceModels/RecurrenceRule";
import { TextDecoder } from 'util';
import BasicRecurrenceRule from "../models/recurrenceModels/BasicRecurrenceRule";


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

    public async updateExpenseCategory(id: string, userID: string, name: string, monthlyBudget: number, recurrenceRule: BasicRecurrenceRule): Promise<boolean> {

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
            const categories: ExpenseCategory[] = result.categories.map((category: any) => {
                const recurrenceRule = new BasicRecurrenceRule(
                    category.recurrenceRule.frequency,
                    category.recurrenceRule.interval,
                    new Date(category.recurrenceRule.startDate),
                    category.recurrenceRule.nextTriggerDate ? new Date(category.recurrenceRule.nextTriggerDate) : undefined,
                    category.recurrenceRule.endDate ? new Date(category.recurrenceRule.endDate) : undefined
                )
                return new ExpenseCategory(category.userID, category.name, category.monthlyBudget, recurrenceRule, category.id);
            });
            return categories;
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
            const data = JSON.parse(resultJson);
            const recurrenceRule = new BasicRecurrenceRule(
                data.recurrenceRule.frequency,
                data.recurrenceRule.interval,
                new Date(data.recurrenceRule.startDate),
                data.recurrenceRule.nextTriggerDate ? new Date(data.recurrenceRule.nextTriggerDate) : undefined,
                data.recurrenceRule.endDate ? new Date(data.recurrenceRule.endDate) : undefined
            )
            return new ExpenseCategory(data.userID, data.name, data.monthlyBudget, recurrenceRule, data.id);
        } catch (err) {
            console.log(err)
        }

        return undefined;
    }
}

export default ExpenseCategoryService;
