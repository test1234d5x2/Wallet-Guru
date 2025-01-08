import Transaction from "./Transaction";
import User from "./User";
import ExpenseCategory from "./ExpenseCategory";
import uuid from 'react-native-uuid';


class Expense implements Transaction {
    private id: string
    private user: User
    title: string
    amount: number
    date: Date
    notes: string
    expenseCategory: ExpenseCategory
    receipt?: string

    constructor(user: User, title: string, amount: number, date: Date, notes: string, expenseCategory: ExpenseCategory, receipt?: string) {
        this.id = uuid.v4()
        this.user = user
        this.title = title
        this.amount = amount
        this.date = date
        this.notes = notes
        this.expenseCategory = expenseCategory
        this.receipt = receipt
    }

    getID(): string {
        return this.id
    }

    getUser(): User {
        return this.user
    }

    deleteTransaction(): boolean {
        console.log("Delete Expense")
        return false
    }

    getPageURL(): string {
        return "/viewExpenseDetailsPage/" + this.id
    }

    getEditURL(): string {
        return "/editExpensePage/" + this.id
    }
}

export default Expense;