import Transaction from "./Transaction";
import uuid from 'react-native-uuid';

class Income implements Transaction {
    private id: string;
    private userID: string;
    title: string;
    amount: number;
    date: Date;
    notes: string;

    constructor(userID: string, title: string, amount: number, date: Date, notes: string, id?: string) {
        this.id = id || uuid.v4();
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
