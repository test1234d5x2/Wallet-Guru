import { GatewayManager } from '../gRPC/init-new'
import Income from '../models/core/Income'
import { TextDecoder } from 'util'

const utf8Decoder = new TextDecoder()

class IncomeService {
    private gm: GatewayManager
    private incomeContractName: string

    constructor(gm: GatewayManager) {
        const INCOME_CONTRACT_NAME = process.env.INCOME_CONTRACT_NAME
        if (!INCOME_CONTRACT_NAME) {
            throw new Error("Set env variables")
        }

        this.gm = gm
        this.incomeContractName = INCOME_CONTRACT_NAME
    }

    public async addIncome(email: string, userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string): Promise<boolean> {
        const income = new Income(userID, title, amount, date, notes, categoryID)

        try {
            const incomeContract = await this.gm.getContract(email, this.incomeContractName)
            await incomeContract.submitTransaction(
                'createIncome',
                JSON.stringify(income.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async updateIncome(email: string, id: string, userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string): Promise<boolean> {
        try {
            const income = await this.findByID(email, id, userID)
            if (!income) {
                throw new Error('Income does not exist')
            }

            income.title = title
            income.amount = amount
            income.date = date
            income.notes = notes
            income.categoryID = categoryID

            const incomeContract = await this.gm.getContract(email, this.incomeContractName)
            await incomeContract.submitTransaction(
                'updateIncome',
                JSON.stringify(income.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async deleteIncome(email: string, id: string, userID: string): Promise<boolean> {
        try {
            const incomeContract = await this.gm.getContract(email, this.incomeContractName)
            await incomeContract.submitTransaction(
                'deleteIncome',
                userID,
                id
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async getAllIncomesByUser(email: string, userID: string): Promise<Income[]> {
        try {
            const incomeContract = await this.gm.getContract(email, this.incomeContractName)
            const resultBytes = await incomeContract.evaluateTransaction(
                'listIncomesByUser',
                userID
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const incomes: Income[] = result.incomes.map((i: any) => new Income(i.userID, i.title, i.amount, new Date(i.date), i.notes, i.categoryID, i.id))
            return incomes
        } catch (err) {
            console.log(err)
        }

        return []
    }

    public async findByID(email: string, id: string, userID: string): Promise<Income | undefined> {
        try {
            const incomeContract = await this.gm.getContract(email, this.incomeContractName)
            const resultBytes = await incomeContract.evaluateTransaction(
                'getIncomeByID',
                userID,
                id
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const data = JSON.parse(resultJson)
            return new Income(data.userID, data.title, data.amount, new Date(data.date), data.notes, data.categoryID, data.id)
        } catch (err) {
            console.log(err)
        }

        return undefined
    }
}

export default IncomeService
