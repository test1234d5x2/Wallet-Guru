import Income from "../Income";
import IncomeRepository from "./IncomeRepository";
import User from "../User";
import filterTransactionByMonth from "@/utils/filterTransactionByMonth";

class IncomeService {
    private repository: IncomeRepository;

    constructor() {
        this.repository = new IncomeRepository();
    }

    public addIncome(user: User, title: string, amount: number, date: Date, notes: string): void {
        const income = new Income(user, title, amount, date, notes);
        this.repository.add(income);
    }

    public updateIncome(id: string, title: string, amount: number, date: Date, notes: string): void {
        const income = this.repository.findById(id);
        if (!income) {
            throw new Error(`Income does not exist`);
        }
        income.title = title;
        income.amount = amount;
        income.date = date;
        income.notes = notes;

        this.repository.update(id, income);
    }

    public deleteIncome(id: string): void {
        this.repository.delete(id);
    }

    public getAllIncomesByUser(user: User): Income[] {
        return this.repository.findByUser(user.getUserID());
    }

    public calculateMonthlyTransactionsTotal(user: User, month: Date): number {
        const transactions = this.repository.findByUser(user.getUserID());
        const monthlyTransactions = filterTransactionByMonth(transactions, month);

        return monthlyTransactions.reduce((sum, expense) => sum + expense.amount, 0);
    }
}

export default IncomeService;
