import IncomeItem from "@/components/listItems/incomeItem";
import Transaction from "./Transaction";
import User from "./User";
import uuid from 'react-native-uuid';

class Income implements Transaction {
    private id: string
    private user: User
    title: string
    amount: number
    date: Date
    notes: string

    constructor(user: User, title: string, amount: number, date: Date, notes: string) {
        this.id = uuid.v4()
        this.user = user
        this.title = title
        this.amount = amount
        this.date = date
        this.notes = notes
    }

    getID(): string {
        return this.id
    }

    getUser(): User {
        return this.user
    }

    deleteTransaction(): boolean {
        console.log("Delete Income")
        return false
    }

    getPageURL(): string {
        return "/viewIncomeDetailsPage"
    }

    getEditURL(): string {
        return "/editIncomePage"
    }

    getListItemDisplay(): React.ReactElement {
        return <IncomeItem income={this} />
    }

    getFullDisplay(): React.ReactElement {
        // Needs Completing
        return <div></div>
    }
}

export default Income;