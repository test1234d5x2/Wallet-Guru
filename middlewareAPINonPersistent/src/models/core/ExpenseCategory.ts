import { v4 } from 'uuid'
import BasicRecurrenceRule from '../recurrenceModels/BasicRecurrenceRule'

class ExpenseCategory {
    private id: string
    private userID: string
    name: string
    monthlyBudget: number
    recurrenceRule: BasicRecurrenceRule
    colour: string

    constructor(userID: string, name: string, monthlyBudget: number, recurrenceRule: BasicRecurrenceRule, colour: string) {
        this.id = v4()
        this.userID = userID
        this.name = name
        this.monthlyBudget = monthlyBudget
        this.recurrenceRule = recurrenceRule
        this.colour = colour
    }

    getID(): string {
        return this.id
    }

    getUserID(): string {
        return this.userID
    }

    calculateBudgetUsed(currentSpending: number): number {
        return currentSpending / this.monthlyBudget
    }

    shouldResetBudget(): boolean {
        if (this.recurrenceRule) {
            return this.recurrenceRule.shouldTrigger()
        }
        return false
    }

    updateBudgetCycle(): void {
        if (this.recurrenceRule && this.recurrenceRule.shouldTrigger()) {
            this.recurrenceRule.nextTriggerDate = this.recurrenceRule.computeNextTriggerDate()
        }
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            name: this.name,
            monthlyBudget: this.monthlyBudget,
            recurrenceRule: this.recurrenceRule,
            colour: this.colour,
        }
    }
}

export default ExpenseCategory
