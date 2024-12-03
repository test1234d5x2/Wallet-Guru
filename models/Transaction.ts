import User from "./User"

interface Transaction {
    id: string
    user: User
    title: string
    amount: number
    date: Date
    notes: string

    deleteTransaction(): boolean
}

export default Transaction;