import User from "./User";
import uuid from 'react-native-uuid';

class ExpenseCategory {
    private id: string
    private user: User
    name: string
    monthlyBudget: number

    constructor(user: User, name: string, monthlyBudget: number) {
        this.id = uuid.v4()
        this.user = user
        this.name = name
        this.monthlyBudget = monthlyBudget
    }

    getID(): string {
        return this.id
    }

    getUser(): User {
        return this.user
    }

    calculateBudgetUsed(currentMonthlySpending: number): number {
        return currentMonthlySpending / this.monthlyBudget
    }
}

export default ExpenseCategory;