import User from "./User"

interface Transaction {
    date: Date
    deleteTransaction(): boolean
    getPageURL(): string
    getEditURL(): string
}

export default Transaction;