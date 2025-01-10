import Income from "../Income";

class IncomeRepository {
    private incomes: Income[] = [];

    public add(income: Income): void {
        const exists = this.incomes.some(inc => inc.getID() === income.getID());
        if (exists) {
            throw new Error(`Income already exists`);
        }
        this.incomes.push(income);
    }

    public update(id: string, updatedIncome: Income): void {
        const index = this.incomes.findIndex(inc => inc.getID() === id);
        if (index === -1) {
            throw new Error(`Income not found`);
        }
        this.incomes[index] = updatedIncome;
    }

    public delete(id: string): void {
        const index = this.incomes.findIndex(inc => inc.getID() === id);
        if (index === -1) {
            throw new Error(`Income not found`);
        }
        this.incomes.splice(index, 1);
    }

    public findByUser(userID: string): Income[] {
        return this.incomes.filter(inc => inc.getUser().getUserID() === userID);
    }

    public findById(id: string): Income | undefined {
        return this.incomes.find(inc => inc.getID() === id);
    }
}

export default IncomeRepository;
