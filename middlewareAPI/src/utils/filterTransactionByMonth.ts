import Transaction from "../models/core/Transaction";

export default function filterTransactionByMonth(transactions: Transaction[], month: Date): Transaction[] {
    return transactions.filter((transaction) => {
        const transactionMonth = transaction.date.getMonth();
        const transactionYear = transaction.date.getFullYear();
        const targetMonth = month.getMonth();
        const targetYear = month.getFullYear();

        return transactionMonth === targetMonth && transactionYear === targetYear;
    });
}
