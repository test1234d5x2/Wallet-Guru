import Transaction from './Transaction'
import { v4 } from 'uuid'

class Income implements Transaction {
    private id: string
    private userID: string
    title: string
    amount: number
    date: Date
    notes: string
    categoryID: string

    constructor(userID: string, title: string, amount: number, date: Date, notes: string, categoyID: string) {
        this.id = v4()
        this.userID = userID
        this.title = title
        this.amount = amount
        this.date = date
        this.notes = notes
        this.categoryID = categoyID
    }

    getID(): string {
        return this.id
    }

    getUserID(): string {
        return this.userID
    }

    getPageURL(): string {
        return "/viewIncomeDetailsPage/" + this.id
    }

    getEditURL(): string {
        return "/editIncomePage/" + this.id
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            title: this.title,
            amount: this.amount,
            date: this.date,
            notes: this.notes,
            categoryID: this.categoryID
        }
    }
}

export default Income
