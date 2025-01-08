import Expense from "./Expense";
import Income from "./Income";
import ExpenseCategory from "./ExpenseCategory";
import Goal from "./Goal";
import User from "./User";
import GoalStatus from "@/enums/GoalStatus";

class Registry {
    private static instance: Registry;

    // Attributes to store data for each model
    private expenses: Expense[] = [];
    private incomes: Income[] = [];
    private expenseCategories: ExpenseCategory[] = [];
    private goals: Goal[] = [];
    private users: User[] = [];
    private authenticatedUser: User | null = null;

    private constructor() { }

    public static getInstance(): Registry {
        if (!Registry.instance) {
            Registry.instance = new Registry();
        }
        return Registry.instance;
    }

    public isAuthenticated(): boolean {
        return this.authenticatedUser !== null;
    }

    public getAuthenticatedUser(): User | null {
        return this.authenticatedUser;
    }

    // Expense Category Methods
    public addExpenseCategory(user: User, name: string, monthlyBudget: number): void {
        const category = new ExpenseCategory(user, name, monthlyBudget);
        const exists = this.expenseCategories.some(cat => cat.getID() === category.getID());
        if (exists) {
            throw new Error(`The expense category already exists`);
        }
        this.expenseCategories.push(category);
    }

    public updateExpenseCategory(id: string, name: string, monthlyBudget: number): void {
        const category = this.expenseCategories.find(cat => cat.getID() === id);
        if (!category) {
            throw new Error(`The expense category does not exist`);
        }
        category.name = name;
        category.monthlyBudget = monthlyBudget;
    }

    public deleteExpenseCategory(id: string): void {
        const index = this.expenseCategories.findIndex(cat => cat.getID() === id);
        if (index === -1) {
            throw new Error(`The expense category does not exist`);
        }
        this.expenseCategories.splice(index, 1);
    }

    public getAllExpenseCategoriesByUser(user: User): ExpenseCategory[] {
        return this.expenseCategories.filter(cat => cat.getUser().getUserID() === user.getUserID());
    }

    // Expense Methods
    public addExpense(user: User, title: string, amount: number, date: Date, notes: string, category: ExpenseCategory, receipt?: string): void {
        const expense = new Expense(user, title, amount, date, notes, category, receipt);
        const exists = this.expenses.some(exp => exp.getID() === expense.getID());
        if (exists) {
            throw new Error(`The expense already exists`);
        }
        this.expenses.push(expense);
    }

    public updateExpense(id: string, title: string, amount: number, date: Date, notes: string, category: ExpenseCategory, receipt?: string): void {
        const expense = this.expenses.find(exp => exp.getID() === id);
        if (!expense) {
            throw new Error(`The expense does not exist`);
        }
        expense.title = title;
        expense.amount = amount;
        expense.date = date;
        expense.notes = notes;
        expense.expenseCategory = category;
        expense.receipt = receipt || undefined;
    }

    public deleteExpense(id: string): void {
        const index = this.expenses.findIndex(exp => exp.getID() === id);
        if (index === -1) {
            throw new Error(`The expense does not exist`);
        }
        this.expenses.splice(index, 1);
    }

    public getAllExpensesByUser(user: User): Expense[] {
        return this.expenses.filter(exp => exp.getUser().getUserID() === user.getUserID());
    }

    // Income Methods
    public addIncome(user: User, title: string, amount: number, date: Date, notes: string): void {
        const income = new Income(user, title, amount, date, notes);
        const exists = this.incomes.some(inc => inc.getID() === income.getID());
        if (exists) {
            throw new Error(`The income already exists`);
        }
        this.incomes.push(income);
    }

    public updateIncome(id: string, title: string, amount: number, date: Date, notes: string): void {
        const income = this.incomes.find(inc => inc.getID() === id);
        if (!income) {
            throw new Error(`The income does not exist`);
        }
        income.title = title;
        income.amount = amount;
        income.date = date;
        income.notes = notes;
    }

    public deleteIncome(id: string): void {
        const index = this.incomes.findIndex(inc => inc.getID() === id);
        if (index === -1) {
            throw new Error(`The income does not exist`);
        }
        this.incomes.splice(index, 1);
    }

    public getAllIncomesByUser(user: User): Income[] {
        return this.incomes.filter(inc => inc.getUser().getUserID() === user.getUserID());
    }

    // Goal Methods
    public addGoal(user: User, title: string, description: string, target: number, status: GoalStatus): void {
        const goal = new Goal(title, user, description, target, status);
        const exists = this.goals.some(g => g.getID() === goal.getID());
        if (exists) {
            throw new Error(`The goal already exists`);
        }
        this.goals.push(goal);
    }

    public updateGoal(id: string, title: string, description: string, target: number, current: number, status: GoalStatus): void {
        const goal = this.goals.find(g => g.getID() === id);
        if (!goal) {
            throw new Error(`The goal does not exist`);
        }
        goal.title = title;
        goal.description = description;
        goal.target = target;
        goal.current = current;
        goal.status = status;
    }

    public deleteGoal(id: string): void {
        const index = this.goals.findIndex(g => g.getID() === id);
        if (index === -1) {
            throw new Error(`The goal does not exist`);
        }
        this.goals.splice(index, 1);
    }

    public getAllGoalsByUser(user: User): Goal[] {
        return this.goals.filter(g => g.getUser().getUserID() === user.getUserID());
    }

    // User Methods
    public addUser(username: string, password: string): void {
        const user = new User(username, password);
        const exists = this.users.some(u => u.getUserID() === user.getUserID());
        if (exists) {
            throw new Error(`The user already exists`);
        }
        this.users.push(user);
    }

    public deleteUser(id: string): void {
        const index = this.users.findIndex(u => u.getUserID() === id);
        if (index === -1) {
            throw new Error(`The user does not exist`);
        }
        this.users.splice(index, 1);
    }

    public getUserById(id: string): User | undefined {
        return this.users.find(u => u.getUserID() === id);
    }
}

export default Registry;
