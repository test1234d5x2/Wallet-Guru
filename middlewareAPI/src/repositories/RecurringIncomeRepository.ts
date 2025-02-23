import RecurringIncome from "../models/recurrenceModels/RecurringIncome";

class RecurringIncomeRepository {
    private recurringIncomes: RecurringIncome[] = [];

    public add(income: RecurringIncome): void {
        const exists = this.recurringIncomes.some(i => i.getID() === income.getID());
        if (exists) {
            throw new Error("Recurring Income already exists");
        }
        this.recurringIncomes.push(income);
    }

    public delete(id: string): void {
        const index = this.recurringIncomes.findIndex(i => i.getID() === id);
        if (index === -1) {
            throw new Error("Recurring Income not found");
        }
        this.recurringIncomes.splice(index, 1);
    }

    public findByUser(userID: string): RecurringIncome[] {
        return this.recurringIncomes.filter(i => i.getUserID() === userID);
    }

    public findById(id: string): RecurringIncome | undefined {
        return this.recurringIncomes.find(i => i.getID() === id);
    }

    // Return all recurring incomes (useful for batch processing)
    public getAll(): RecurringIncome[] {
        return this.recurringIncomes;
    }
}

export default RecurringIncomeRepository;
