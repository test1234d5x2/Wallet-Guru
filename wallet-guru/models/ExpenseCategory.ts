import uuid from 'react-native-uuid';

class ExpenseCategory {
    private id: string;
    private userID: string;
    name: string;
    monthlyBudget: number;

    constructor(userID: string, name: string, monthlyBudget: number, id?: string) {
        this.id = id || uuid.v4();
        this.userID = userID;
        this.name = name;
        this.monthlyBudget = monthlyBudget;
    }

    getID(): string {
        return this.id;
    }

    getUserID(): string {
        return this.userID;
    }

    calculateBudgetUsed(currentMonthlySpending: number): number {
        return currentMonthlySpending / this.monthlyBudget;
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            name: this.name,
            monthlyBudget: this.monthlyBudget,
        }
    }
}

export default ExpenseCategory;
