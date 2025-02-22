import Transaction from "./Transaction";
import {v4} from 'uuid';

class Income implements Transaction {
    private id: string;
    private userID: string;
    title: string;
    amount: number;
    date: Date;
    notes: string;

    constructor(userID: string, title: string, amount: number, date: Date, notes: string) {
        this.id = v4();
        this.userID = userID;
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.notes = notes;
    }

    getID(): string {
        return this.id;
    }

    getUserID(): string {
        return this.userID;
    }

    deleteTransaction(): boolean {
        console.log("Delete Income");
        return false;
    }

    getPageURL(): string {
        return "/viewIncomeDetailsPage/" + this.id;
    }

    getEditURL(): string {
        return "/editIncomePage/" + this.id;
    }
}

export default Income;
