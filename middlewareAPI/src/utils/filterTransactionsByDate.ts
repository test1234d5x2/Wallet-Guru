import Transaction from "../models/Transaction";

export default function filterTransactionsByDate<T extends Transaction>(txList: T[], startDate: Date, endDate: Date): T[] {
    return txList.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
    });
}