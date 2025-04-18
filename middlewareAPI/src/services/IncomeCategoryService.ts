import { Contract } from '@hyperledger/fabric-gateway'
import IncomeCategory from '../models/core/IncomeCategory'
import { TextDecoder } from 'util'

const utf8Decoder = new TextDecoder()

class IncomeCategoryService {
    private incomeCategoryContract: Contract

    constructor(incomeCategoryContract: Contract) {
        this.incomeCategoryContract = incomeCategoryContract
    }

    public async addIncomeCategory(userID: string, name: string, colour: string): Promise<boolean> {
        const category = new IncomeCategory(userID, name, undefined, colour)
        try {
            await this.incomeCategoryContract.submitTransaction(
                'createIncomeCategory',
                JSON.stringify(category.toJSON())
            )
            return true
        } catch (err) {
            console.log(err)
        }
        return false
    }

    public async updateIncomeCategory(id: string, userID: string, name: string, colour: string): Promise<boolean> {
        try {
            const category = await this.findByID(id, userID)
            if (!category) {
                throw new Error('Category not found')
            }

            category.name = name
            category.colour = colour

            await this.incomeCategoryContract.submitTransaction(
                'updateIncomeCategory',
                JSON.stringify(category.toJSON())
            )
            return true
        } catch (err) {
            console.log(err)
        }
        return false
    }

    public async deleteIncomeCategory(id: string, userID: string): Promise<boolean> {
        try {
            await this.incomeCategoryContract.submitTransaction(
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

    public async getAllCategoriesByUser(userID: string): Promise<IncomeCategory[]> {
        try {
            const resultBytes = await this.incomeCategoryContract.evaluateTransaction(
                'listIncomeCategoriesByUser',
                userID
            )
            const resultJson = utf8Decoder.decode(resultBytes)
            const result = JSON.parse(resultJson)
            const categories: IncomeCategory[] = result.categories.map((category: any) =>
                new IncomeCategory(
                    category.userID,
                    category.name,
                    category.id,
                    category.colour
                )
            )
            return categories
        } catch (err) {
            console.log(err)
        }
        return []
    }

    public async findByID(id: string, userID: string): Promise<IncomeCategory | undefined> {
        try {
            const resultBytes = await this.incomeCategoryContract.evaluateTransaction(
                'getIncomeCategoryByID',
                userID,
                id
            )
            const resultJson = utf8Decoder.decode(resultBytes)
            const data = JSON.parse(resultJson)
            return new IncomeCategory(
                data.userID,
                data.name,
                data.id,
                data.colour
            )
        } catch (err) {
            console.log(err)
        }
        return undefined
    }
}

export default IncomeCategoryService
