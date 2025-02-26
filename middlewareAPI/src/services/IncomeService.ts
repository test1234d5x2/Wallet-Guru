import Income from "../models/core/Income";
import IncomeRepository from "../repositories/IncomeRepository";
import { Contract } from "@hyperledger/fabric-gateway";
import { TextDecoder } from 'util';



const utf8Decoder = new TextDecoder();


class IncomeService {
    private repository: IncomeRepository;
    private incomeContract: Contract;

    constructor(c: Contract) {
        this.repository = new IncomeRepository();
        this.incomeContract = c;
    }

    public async addIncome(userID: string, title: string, amount: number, date: Date, notes: string): Promise<boolean> {
        const income = new Income(userID, title, amount, date, notes);

        try {
            await this.incomeContract.submitTransaction(
                "createIncome",
                JSON.stringify(income.toJSON())
            )

            return true;
        } catch (err: any) {
            console.log(err)
        }

        return false;
    }

    public async updateIncome(id: string, userID: string, title: string, amount: number, date: Date, notes: string): Promise<boolean> {
        try {
            const income = await this.findByID(id, userID);
            if (!income) {
                throw new Error(`Income does not exist`);
            }

            income.title = title;
            income.amount = amount;
            income.date = date;
            income.notes = notes;

            await this.incomeContract.submitTransaction(
                "updateIncome",
                JSON.stringify(income.toJSON())
            )
    
            return true;
        } catch (err: any) {
            console.log(err)
        }

        return false;
    }

    public async deleteIncome(id: string, userID: string): Promise<boolean> {
        try {
            await this.incomeContract.submitTransaction(
                "deleteIncome",
                userID,
                id
            )
    
            return true;
        } catch (err: any) {
            console.log(err)
        }
    
        return false
    }

    public async getAllIncomesByUser(userID: string): Promise<Income[]> {
        try {
            const resultBytes = await this.incomeContract.evaluateTransaction(
                "listIncomesByUser",
                userID,
            )
    
            const resultJson = utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            const incomes: Income[] = result.incomes;
    
            return incomes
        } catch (err) {
            console.log(err)
        }
    
        return [];
    }

    public async findByID(id: string, userID: string): Promise<Income | undefined> {
        try {
            const resultBytes = await this.incomeContract.evaluateTransaction(
                "getIncomeByID",
                userID,
                id,
            )

            const resultJson = utf8Decoder.decode(resultBytes);
            const result: Income = JSON.parse(resultJson);
            return result;
        } catch (err) {
            console.log(err)
        }

        return undefined;
    }
}

export default IncomeService;
