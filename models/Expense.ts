import Transaction from "./Transaction";
import User from "./User";
import ExpenseCategory from "./ExpenseCategory";
import uuid from 'react-native-uuid';


class Expense implements Transaction {
    id: string
    user: User
    title: string
    amount: number
    date: Date
    notes: string
    expenseCategory: ExpenseCategory

    constructor(user: User, title: string, amount: number, date: Date, notes: string, expenseCategory: ExpenseCategory) {
        this.id = uuid.v4()
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