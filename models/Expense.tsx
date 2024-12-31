import Transaction from "./Transaction";
import User from "./User";
import ExpenseCategory from "./ExpenseCategory";
import uuid from 'react-native-uuid';
import ExpenseItem from "@/components/listItems/expenseItem";
import Receipt from "./Receipt";


class Expense implements Transaction {
    private id: string
    private user: User
    title: string
    amount: number
    date: Date
    notes: string
    expenseCategory: ExpenseCategory
    receipt?: Receipt

    constructor(user: User, title: string, amount: number, date: Date, notes: string, expenseCategory: ExpenseCategory, receipt: Receipt) {
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
        return "/viewExpenseDetailsPage"
    }

    getEditURL(): string {
        return "/editExpensePage"
    }

    getListItemDisplay(): React.ReactElement {
        return <ExpenseItem expense={this} key={uuid.v4()} />
    }

    getFullDisplay(): React.ReactElement {
        // Needs Completing
        return <div></div>
    }
}

export default Expense;