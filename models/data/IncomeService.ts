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
    }

    public deleteIncome(id: string): void {
        this.repository.delete(id);
    }

    public getAllIncomesByUser(user: User): Income[] {
        return this.repository.findByUser(user.getUserID());
    }

    public calculateMonthlyTransactionsTotal(user: User, month: Date): number {
        const monthlyTransactions = this.getFilteredIncomes(user, month);
        return this.reduceIncomesToTotal(monthlyTransactions);
    }

    public getMonthlyIncomeTrends(user: User, months: Date[]): number[] {
        return months.map(month => {return this.calculateMonthlyTransactionsTotal(user, month)});
    }


    private getFilteredIncomes(user: User, month: Date): Income[] {
        const incomes = this.getAllIncomesByUser(user);
        return filterTransactionByMonth(incomes, month) as Income[];
    }


    private reduceIncomesToTotal(incomes: Income[]): number {
        return incomes.reduce((sum, income) => sum + income.amount, 0);
    }
}

export default IncomeService;
