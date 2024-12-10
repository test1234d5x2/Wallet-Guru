import IncomeItem from "@/components/listItems/incomeItem";
import Transaction from "./Transaction";
import User from "./User";
import uuid from 'react-native-uuid';

class Income implements Transaction {
    id: string
    user: User
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

    deleteTransaction(): boolean {
        console.log("Delete Income")
        return false
    }

    getPageURL(): string {
        return "/viewIncomeDetailsPage"
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