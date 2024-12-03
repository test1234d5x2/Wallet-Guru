import User from "./User";
import { v4 as uuid4 } from "uuid";

class ExpenseCategory {
    id: string
    name: string
    monthlyBudget: number

    constructor(name: string, monthlyBudget: number) {
        this.id = uuid4()
        this.name = name
        this.monthlyBudget = monthlyBudget
    }
}

export default ExpenseCategory;