import RecurringIncomeRepository from "../repositories/RecurringIncomeRepository";
import RecurrenceRule from "../models/recurrenceModels/RecurrenceRule";
import RecurringIncome from "../models/recurrenceModels/RecurringIncome";
import IncomeService from "./IncomeService";
import { Contract } from "@hyperledger/fabric-gateway";
import { TextDecoder } from 'util';
import BasicRecurrenceRule from "../models/recurrenceModels/BasicRecurrenceRule";



const utf8Decoder = new TextDecoder();



class RecurringIncomeService {
    private repository: RecurringIncomeRepository;
    private incomeService: IncomeService;
    private contract: Contract;

    constructor(incomeService: IncomeService, recurringIncomeContract: Contract) {
        this.repository = new RecurringIncomeRepository();
        this.incomeService = incomeService;
        this.contract = recurringIncomeContract;
    }

    public async addRecurringIncome(userID: string, title: string, amount: number, date: Date, notes: string, recurrenceRule: RecurrenceRule): Promise<boolean> {
        const recurringIncome = new RecurringIncome(userID, title, amount, date, notes, recurrenceRule);

        try {
            await this.contract.submitTransaction(
                "createRecurringIncome",
                JSON.stringify(recurringIncome.toJSON())
            )

            return true;
        } catch (err: any) {
            console.log(err)
        }

        return false;
    }

    public async updateRecurringIncome(id: string, userID: string, title: string, amount: number, date: Date, notes: string): Promise<boolean> {
        try {
            const recurringIncome = await this.findByID(id, userID);
            if (!recurringIncome) {
                throw new Error("The recurring income does not exist");
            }

            recurringIncome.title = title;
            recurringIncome.amount = amount;
            recurringIncome.date = date;
            recurringIncome.notes = notes;

            await this.contract.submitTransaction(
                "updateRecurringIncome",
                JSON.stringify(recurringIncome.toJSON())
            )

            return true;
        } catch (err: any) {
            console.log(err)
        }

        return false;
    }

    public async deleteRecurringIncome(id: string, userID: string): Promise<boolean> {
        try {
            await this.contract.submitTransaction(
                "deleteRecurringIncome",
                userID,
                id,
            )

            return true;
        } catch (err: any) {
            console.log(err)
        }

        return false;
    }

    public async getAllRecurringIncomesByUser(userID: string): Promise<RecurringIncome[]> {
        try {
            const resultBytes = await this.contract.evaluateTransaction(
                "listRecurringIncomesByUser",
                userID,
            )
    
            const resultJson = utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            const incomes: RecurringIncome[] = result.recurringIncomes.map((i: any) => {
                const recurrenceRule = new BasicRecurrenceRule(i.recurrenceRule.frequency, i.recurrenceRule.interval, new Date(i.recurrenceRule.startDate), new Date(i.recurrenceRule.nextTriggerDate), new Date(i.recurrenceRule.endDate))
                return new RecurringIncome(i.userID, i.title, i.amount, new Date(i.date), i.notes, recurrenceRule, i.id);
            });
            return incomes;
        } catch (err: any) {
            console.log(err)
        }
    
        return [];
    }

    public async findByID(id: string, userID: string): Promise<RecurringIncome | undefined> {
        try {
            const resultBytes = await this.contract.evaluateTransaction(
                "getRecurringIncomeByID",
                userID,
                id,
            )

            const resultJson = utf8Decoder.decode(resultBytes);
            const data = JSON.parse(resultJson);
            const recurrenceRule = new BasicRecurrenceRule(data.recurrenceRule.frequency, data.recurrenceRule.interval, new Date(data.recurrenceRule.startDate), new Date(data.recurrenceRule.nextTriggerDate), new Date(data.recurrenceRule.endDate))
            return new RecurringIncome(data.userID, data.title, data.amount, new Date(data.date), data.notes, recurrenceRule, data.id);
        } catch (err) {
            console.log(err)
        }

        return undefined
    }

    // CHAINCODE NEEDS UPDATING
    public async processDueRecurringIncomes(): Promise<void> {
        const recurringIncomes: RecurringIncome[] = [];
        recurringIncomes.forEach(recIncome => {
            if (recIncome.recurrenceRule.shouldTrigger()) {
                this.incomeService.addIncome(recIncome.getUserID(), recIncome.title, recIncome.amount, new Date(), recIncome.notes);
                recIncome.recurrenceRule.computeNextTriggerDate();
            }
        });
    }
}

export default RecurringIncomeService;
