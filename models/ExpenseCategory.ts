import User from "./User";
import uuid from 'react-native-uuid';

class ExpenseCategory {
    private id: string
    private user: User
    name: string
    currentMonthlySpending: number
    monthlyBudget: number

    constructor(user: User, name: string, currentMonthlySpending: number, monthlyBudget: number) {
        this.id = uuid.v4()
        this.user = user
        this.name = name
        this.currentMonthlySpending = currentMonthlySpending
        this.monthlyBudget = monthlyBudget
    }

    getID(): string {
        return this.id
    }

    getUser(): User {
        return this.user
    }

    calculateBudgetUsed(): number {
        return this.currentMonthlySpending / this.monthlyBudget
    }
}

export default ExpenseCategory;