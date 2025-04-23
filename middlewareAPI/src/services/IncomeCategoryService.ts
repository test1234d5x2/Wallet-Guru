import IncomeCategory from '../models/core/IncomeCategory'
import { TextDecoder } from 'util'
import { GatewayManager } from '../gRPC/init'

const utf8Decoder = new TextDecoder()

class IncomeCategoryService {
    private gm: GatewayManager
    private incomeCategoryContractName: string

    constructor(gm: GatewayManager) {
        const INCOME_CATEGORY_CONTRACT_NAME = process.env.INCOME_CATEGORY_CONTRACT_NAME
        if (!INCOME_CATEGORY_CONTRACT_NAME) {
            throw new Error("Set env variables")
        }

        this.gm = gm
        this.incomeCategoryContractName = INCOME_CATEGORY_CONTRACT_NAME
    }

    public async addIncomeCategory(email: string, userID: string, name: string, colour: string): Promise<boolean> {
        const category = new IncomeCategory(userID, name, undefined, colour)
        try {

            const incomeCategoryContract = await this.gm.getContract(email, this.incomeCategoryContractName)
            await incomeCategoryContract.submitTransaction(
                'createIncomeCategory',
                JSON.stringify(category.toJSON())
            )
            return true
        } catch (err) {
            console.log(err)
        }
        return false
    }

    public async updateIncomeCategory(email: string, id: string, userID: string, name: string, colour: string): Promise<boolean> {
        try {
            const category = await this.findByID(email, id, userID)
            if (!category) {
                throw new Error('Category not found')
            }

            category.name = name
            category.colour = colour

            const incomeCategoryContract = await this.gm.getContract(email, this.incomeCategoryContractName)
            await incomeCategoryContract.submitTransaction(
                'updateIncomeCategory',
                JSON.stringify(category.toJSON())
            )
            return true
        } catch (err) {
            console.log(err)
        }
        return false
    }

    public async deleteIncomeCategory(email: string, id: string, userID: string): Promise<boolean> {
        try {
            const incomeCategoryContract = await this.gm.getContract(email, this.incomeCategoryContractName)
            await incomeCategoryContract.submitTransaction(
                'deleteIncomeCategory',
                userID,
                id
            )
            return true
        } catch (err) {
            console.log(err)
        }
        return false
    }

    public async getAllCategoriesByUser(email: string, userID: string): Promise<IncomeCategory[]> {
        try {
            const incomeCategoryContract = await this.gm.getContract(email, this.incomeCategoryContractName)
            const resultBytes = await incomeCategoryContract.evaluateTransaction(
                'listIncomeCategoriesByUser',
                userID
            )
            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const categories: IncomeCategory[] = result.categories.map((category: any) =>
                new IncomeCategory(category.userID, category.name, category.id, category.colour)
            )
            return categories
        } catch (err) {
            console.log(err)
        }
        return []
    }

    public async findByID(email: string, id: string, userID: string): Promise<IncomeCategory | undefined> {
        try {
            const incomeCategoryContract = await this.gm.getContract(email, this.incomeCategoryContractName)
            const resultBytes = await incomeCategoryContract.evaluateTransaction(
                'getIncomeCategoryByID',
                userID,
                id
            )
            const resultJson = utf8Decoder.decode(resultBytes)
            const data = JSON.parse(resultJson)
            return new IncomeCategory(data.userID, data.name, data.id, data.colour)
        } catch (err) {
            console.log(err)
        }
        return undefined
    }
}

export default IncomeCategoryService
