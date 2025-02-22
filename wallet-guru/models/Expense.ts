import Transaction from "./Transaction";
import uuid from 'react-native-uuid';

class Expense implements Transaction {
    private id: string;
    private userID: string;
    title: string;
    amount: number;
    date: Date;
    notes: string;
    categoryID: string;
    receipt?: string;

    constructor(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, receipt?: string, id?: string) {
        this.id = id || uuid.v4();
        this.userID = userID;
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.notes = notes;
        this.categoryID = categoryID;
        this.receipt = receipt;
    }

    getID(): string {
        return this.id;
    }

    getUserID(): string {
        return this.userID;
    }

    getCategoryID(): string {
        return this.categoryID;
    }

    deleteTransaction(): boolean {
        console.log("Delete Expense");
        return false;
    }

    getPageURL(): string {
        return "/viewExpenseDetailsPage/" + this.id;
    }

    getEditURL(): string {
        return "/editExpensePage/" + this.id;
    }
}

export default Expense;
