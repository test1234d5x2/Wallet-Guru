interface Transaction {
    title: string
    date: Date
    amount: number
    notes: string
    categoryID: string
    getPageURL(): string
    getEditURL(): string
}

export default Transaction