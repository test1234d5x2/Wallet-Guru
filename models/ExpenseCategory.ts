import User from "./User";
import uuid from 'react-native-uuid';

class ExpenseCategory {
    id: string
    name: string
    monthlyBudget: number

    constructor(name: string, monthlyBudget: number) {
        this.id = uuid.v4()
        this.name = name
        this.monthlyBudget = monthlyBudget
    }
}

export default ExpenseCategory;