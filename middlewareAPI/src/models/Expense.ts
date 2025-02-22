import Transaction from "./Transaction";
import {v4} from 'uuid';

class Expense implements Transaction {
    private id: string;
    private userID: string;
    title: string;
    amount: number;
    date: Date;
    notes: string;
    categoryID: string;
    receipt?: string;

    constructor(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, receipt?: string) {
        this.id = v4();
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

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            title: this.title,
            amount: this.amount,
            date: this.date,
            notes: this.notes,
            categoryID: this.categoryID,
            receipt: this.receipt,
        }
    }
}

export default Expense;
