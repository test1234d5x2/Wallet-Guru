import uuid from 'react-native-uuid';
import RecurringBudget from '../recurrenceModels/RecurringBudget';

class ExpenseCategory {
    private id: string;
    private userID: string;
    name: string;
    budgetAmount: number;
    recurrenceRule?: RecurringBudget;

    constructor(userID: string, name: string, budgetAmount: number, recurrenceRule?: RecurringBudget, id?: string) {
        this.id = id || uuid.v4();
        this.userID = userID;
        this.name = name;
        this.budgetAmount = budgetAmount;
        this.recurrenceRule = recurrenceRule;
    }

    getID(): string {
        return this.id;
    }

    getUserID(): string {
        return this.userID;
    }

    calculateBudgetUsed(currentSpending: number): number {
        return currentSpending / this.budgetAmount;
    }

    shouldResetBudget(): boolean {
        if (this.recurrenceRule) {
            return this.recurrenceRule.shouldTrigger();
        }
        return false;
    }

    updateBudgetCycle(): void {
        if (this.recurrenceRule && this.recurrenceRule.shouldTrigger()) {
            this.recurrenceRule.nextTriggerDate = this.recurrenceRule.computeNextTriggerDate();
        }
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            name: this.name,
            budgetAmount: this.budgetAmount,
            recurrenceRule: this.recurrenceRule,
        };
    }
}

export default ExpenseCategory;
