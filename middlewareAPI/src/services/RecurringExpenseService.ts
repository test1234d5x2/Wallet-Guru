import RecurringExpenseRepository from "../repositories/RecurringExpenseRepository";
import RecurringExpense from "../models/recurrenceModels/RecurringExpense";
import RecurrenceRule from "../models/recurrenceModels/RecurrenceRule";
import Registry from "../registry/Registry";

class RecurringExpenseService {
    private repository: RecurringExpenseRepository;
    private registry: Registry;

    constructor() {
        this.repository = new RecurringExpenseRepository();
        this.registry = Registry.getInstance();
    }

    public addRecurringExpense(userID: string, title: string, amount: number, date: Date, notes: string, categoryID: string, recurrenceRule: RecurrenceRule): void {
        const recurringExpense = new RecurringExpense(userID, title, amount, date, notes, categoryID, recurrenceRule);
        this.repository.add(recurringExpense);
    }

    public updateRecurringExpense(id: string, title: string, amount: number, date: Date, notes: string, categoryID: string): void {
        const recurringExpense = this.repository.findById(id);
        if (!recurringExpense) {
            throw new Error(`The recurring expense does not exist`);
        }
        recurringExpense.title = title;
        recurringExpense.amount = amount;
        recurringExpense.date = date;
        recurringExpense.notes = notes;
        recurringExpense.categoryID = categoryID;
    }

    public deleteRecurringExpense(id: string): void {
        this.repository.delete(id);
    }

    public getAllRecurringExpensesByUser(userID: string): RecurringExpense[] {
        return this.repository.findByUser(userID);
    }

    public findByID(id: string): RecurringExpense | undefined {
        return this.repository.findById(id);
    }

    public processDueRecurringExpenses(): void {
        const recurringExpenses = this.repository.getAll();
        recurringExpenses.forEach(recExp => {
            if (recExp.recurrenceRule.shouldTrigger()) {
                this.registry.expenseService.addExpense(recExp.getUserID(), recExp.title, recExp.amount, new Date(), recExp.notes, recExp.categoryID, recExp.receipt);
                recExp.recurrenceRule.computeNextTriggerDate();
            }
        });
    }
}

export default RecurringExpenseService;
