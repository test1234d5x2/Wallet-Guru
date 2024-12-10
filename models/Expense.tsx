import Transaction from "./Transaction";
import User from "./User";
import ExpenseCategory from "./ExpenseCategory";
import uuid from 'react-native-uuid';
import ExpenseItem from "@/components/listItems/expenseItem";


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
        console.log("Delete Expense")
        return false
    }

    getPageURL(): string {
        return "/viewExpenseDetailsPage"
    }

    getListItemDisplay(): React.ReactElement {
        return <ExpenseItem expense={this} />
    }

    getFullDisplay(): React.ReactElement {
        // Needs Completing
        return <div></div>
    }
}

export default Expense;