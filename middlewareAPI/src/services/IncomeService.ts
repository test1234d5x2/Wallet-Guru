import Income from "../models/Income";
import IncomeRepository from "../repositories/IncomeRepository";
import User from "../models/User";
import filterTransactionByMonth from "../utils/filterTransactionByMonth";

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

    public findByID(id: string): Income | undefined {
        return this.repository.findById(id);
    }
}

export default IncomeService;
