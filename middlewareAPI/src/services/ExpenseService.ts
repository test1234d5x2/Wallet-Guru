import Expense from '../models/core/Expense'
import { TextDecoder } from 'util'

import { GatewayManager } from '../gRPC/init'

const utf8Decoder = new TextDecoder()

class ExpenseService {
    private gm: GatewayManager
    private expenseContractName: string

    constructor(gm: GatewayManager) {
        const EXPENSE_CONTRACT_NAME = process.env.EXPENSE_CONTRACT_NAME
        if (!EXPENSE_CONTRACT_NAME) {
            throw new Error("Set env variables first")
        }

        this.expenseContractName = EXPENSE_CONTRACT_NAME
        this.gm = gm
    }

    public async addExpense(email: string, userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, receipt?: string): Promise<boolean> {
        try {
            const expense = new Expense(userID, title, amount, date, notes, categoryID, receipt)
            const expenseContract = await this.gm.getContract(email, this.expenseContractName)
            await expenseContract.submitTransaction(
                'createExpense',
                JSON.stringify(expense.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async updateExpense(email: string, id: string, userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, receipt?: string): Promise<boolean> {
        try {
            const expense = await this.findByID(email, id, userID)
            if (!expense) {
                throw new Error('The expense does not exist')
            }

            expense.title = title
            expense.amount = amount
            expense.date = date
            expense.notes = notes
            expense.categoryID = categoryID
            expense.receipt = receipt || undefined

            const expenseContract = await this.gm.getContract(email, this.expenseContractName)
            await expenseContract.submitTransaction(
                'updateExpense',
                JSON.stringify(expense.toJSON())
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async deleteExpense(email: string, id: string, userID: string): Promise<boolean> {
        try {
            const expenseContract = await this.gm.getContract(email, this.expenseContractName)
            await expenseContract.submitTransaction(
                'deleteExpense',
                userID,
                id
            )

            return true
        } catch (err: any) {
            console.log(err)
        }

        return false
    }

    public async getAllExpensesByUser(email: string, userID: string): Promise<Expense[]> {
        try {
            const expenseContract = await this.gm.getContract(email, this.expenseContractName)
            const resultBytes = await expenseContract.evaluateTransaction(
                'listExpensesByUser',
                userID
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const expenses: Expense[] = result.expenses.map((e: any) => new Expense(e.userID, e.title, e.amount, new Date(e.date), e.notes, e.categoryID, e.receipt, e.id))
            return expenses
        } catch (err) {
            console.log(err)
        }

        return []
    }

    public async findByID(email: string, id: string, userID: string): Promise<Expense | undefined> {
        try {
            const expenseContract = await this.gm.getContract(email, this.expenseContractName)
            const resultBytes = await expenseContract.evaluateTransaction(
                'getExpenseByID',
                userID,
                id
            )

            const resultJson = utf8Decoder.decode(resultBytes)
            const data: any = JSON.parse(resultJson)
            return new Expense(data.userID, data.title, data.amount, new Date(data.date), data.notes, data.categoryID, data.receipt, data.id)
        } catch (err) {
            console.log(err)
        }

        return undefined
    }
}

export default ExpenseService
