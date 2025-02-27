import Transaction from "@/models/core/Transaction";
import filterTransactionByTimeWindow from "./filterTransactionsByTimeWindow";

export default function calculateTransactionsTotalForTimeWindow(transactions: Transaction[], startDate: Date, endDate: Date): number {
    const monthlyTransactions = getFilteredTransactions(transactions, startDate, endDate);
    return reducesTransactionsToTotal(monthlyTransactions);
}


function getFilteredTransactions<T extends Transaction>(transactions: T[], startDate: Date, endDate: Date): T[] {
    return filterTransactionByTimeWindow(transactions, startDate, endDate);
}


function reducesTransactionsToTotal(transactions: Transaction[]): number {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}