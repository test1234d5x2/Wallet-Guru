interface Transaction {
    title: string
    date: Date
    amount: number
    notes: string
    deleteTransaction(): boolean
    getPageURL(): string
    getEditURL(): string
}

export default Transaction;