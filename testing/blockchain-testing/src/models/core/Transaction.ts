export default interface Transaction {
    title: string
    date: Date
    amount: number
    notes: string
    getPageURL(): string
    getEditURL(): string
}