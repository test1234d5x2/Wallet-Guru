import BasicRecurrenceRule from '../recurrenceModels/BasicRecurrenceRule'
import Category from './Category'

class ExpenseCategory extends Category {
    public monthlyBudget: number
    public recurrenceRule: BasicRecurrenceRule

    constructor(userID: string, name: string, monthlyBudget: number, recurrenceRule: BasicRecurrenceRule, id?: string, colour?: string) {
        super(userID, name, "", colour)
        this.monthlyBudget = monthlyBudget
        this.recurrenceRule = recurrenceRule
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
