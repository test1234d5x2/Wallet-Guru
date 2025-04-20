import Category from './Category'

export default class IncomeCategory extends Category {
    constructor(userID: string, name: string, id?: string, colour?: string) {
        super(userID, name, id, colour)
    }
}