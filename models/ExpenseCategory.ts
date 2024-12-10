import User from "./User";
import uuid from 'react-native-uuid';

class ExpenseCategory {
    id: string
    user: User
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

    calculateBudgetUsed(): number {
        return this.currentMonthlySpending / this.monthlyBudget
    }
}

export default ExpenseCategory;