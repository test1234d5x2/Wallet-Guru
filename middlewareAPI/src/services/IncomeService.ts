import Income from "../models/Income";
import IncomeRepository from "../repositories/IncomeRepository";

class IncomeService {
    private repository: IncomeRepository;

    constructor() {
        this.repository = new IncomeRepository();
    }

    public addIncome(userID: string, title: string, amount: number, date: Date, notes: string): void {
        const income = new Income(userID, title, amount, date, notes);
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

    public getAllIncomesByUser(userID: string): Income[] {
        return this.repository.findByUser(userID);
    }
    
    public findByID(id: string): Income | undefined {
        return this.repository.findById(id);
    }
}

export default IncomeService;
