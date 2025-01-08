import User from "./User"

interface Transaction {
    deleteTransaction(): boolean
    getPageURL(): string
    getEditURL(): string
}

export default Transaction;