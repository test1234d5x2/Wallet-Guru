import { v4 as uuid4 } from "uuid";

import Transaction from "./Transaction";
import User from "./User";
import ExpenseCategory from "./ExpenseCategory";


class Expense implements Transaction {
    id: string
    user: User
    title: string
    amount: number
    date: Date
    notes: string
    expenseCategory: ExpenseCategory

    constructor(user: User, title: string, amount: number, date: Date, notes: string, expenseCategory: ExpenseCategory) {
        this.id = uuid4()
        this.user = user
        this.title = title
        this.amount = amount
        this.date = date
        this.notes = notes
        this.expenseCategory = expenseCategory
    }

    deleteTransaction(): boolean {
        return false
    }
}

export default Expense;