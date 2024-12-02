import Transaction from "./Transaction";
import User from "./User";
import { v4 as uuid4 } from "uuid";

class Income implements Transaction {
    id: string
    user: User
    title: string
    amount: number
    date: Date
    notes: string

    constructor(user: User, title: string, amount: number, date: Date, notes: string) {
        this.id = uuid4()
        this.user = user
        this.title = title
        this.amount = amount
        this.date = date
        this.notes = notes
    }

    deleteTransaction(): boolean {
        return false
    }
}

export default Income;