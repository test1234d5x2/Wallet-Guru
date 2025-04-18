import Transaction from "@/models/core/Transaction"

export default function filterTransactionsByTimeWindow<T extends Transaction>(transactions: T[], startDate: Date, endDate: Date): T[] {
    const startTimestamp = startDate.getTime()
    const endTimestamp = endDate.getTime()

    return transactions.filter(transaction => {
        const transactionTimestamp = transaction.date.getTime()
        return transactionTimestamp >= startTimestamp && transactionTimestamp <= endTimestamp
    })
}
