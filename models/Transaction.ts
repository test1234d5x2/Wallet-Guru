import User from "./User"

interface Transaction {
    deleteTransaction(): boolean
    getPageURL(): string
    getEditURL(): string
    getListItemDisplay(): React.ReactElement
    getFullDisplay(): React.ReactElement
}

export default Transaction;