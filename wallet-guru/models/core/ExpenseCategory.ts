import BasicRecurrenceRule from '../recurrenceModels/BasicRecurrenceRule'
import Category from './Category'

export default class ExpenseCategory extends Category {
    public monthlyBudget: number
    public recurrenceRule: BasicRecurrenceRule

    constructor(userID: string, name: string, monthlyBudget: number, recurrenceRule: BasicRecurrenceRule, id?: string, colour?: string) {
        super(userID, name, id, colour)
        this.monthlyBudget = monthlyBudget
        this.recurrenceRule = recurrenceRule
    }

    public calculateBudgetUsed(currentSpending: number): number {
        return currentSpending / this.monthlyBudget
    }

    public shouldResetBudget(): boolean {
        return this.recurrenceRule.shouldTrigger()
    }

    public updateBudgetCycle(): void {
        if (this.recurrenceRule.shouldTrigger()) {
            this.recurrenceRule.nextTriggerDate = this.recurrenceRule.computeNextTriggerDate()
        }
    }

    public toJSON() {
        return {
            ...super.toJSON(),
            monthlyBudget: this.monthlyBudget,
            recurrenceRule: this.recurrenceRule,
        }
    }
}