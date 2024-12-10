import User from "./User"

interface Transaction {
    id: string
    user: User
    title: string
    amount: number
    date: Date
    notes: string

    deleteTransaction(): boolean
    getPageURL(): string
    getEditURL(): string
    getListItemDisplay(): React.ReactElement
    getFullDisplay(): React.ReactElement
}

export default Transaction;