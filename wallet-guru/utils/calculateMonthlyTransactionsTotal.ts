import Transaction from "@/models/core/Transaction";
import filterTransactionByMonth from "./filterTransactionByMonth";


export default function calculateMonthlyTransactionsTotal(transactions: Transaction[], month: Date) {
    const monthlyTransactions = getFilteredTransactions(transactions, month);
    return reducesTransactionsToTotal(monthlyTransactions);
}


function getFilteredTransactions(transactions: Transaction[], month: Date): Transaction[] {
    return filterTransactionByMonth(transactions, month);
}


function reducesTransactionsToTotal(transactions: Transaction[]): number {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}