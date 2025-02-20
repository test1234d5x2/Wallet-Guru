import User from "../models/User";
import ExpenseService from "./ExpenseService";
import IncomeService from "./IncomeService";

class AnalyticsService {
    getAnalyticsService() {
        throw new Error('Method not implemented.');
    }
    private expenseService: ExpenseService;
    private incomeService: IncomeService;

    constructor(expenseService: ExpenseService, incomeService: IncomeService) {
        this.expenseService = expenseService;
        this.incomeService = incomeService;
    }

    public getCategoryDistribution(user: User, month: Date): { name: string, total: number }[] {
        const categoryTotals = this.expenseService.getTotalExpensesByCategory(user, month);

        return Object.entries(categoryTotals).map(([name, total]) => ({
            name,
            total,
        }));
    }

    public getIncomeVsExpenses(user: User, months: Date[]): { income: number[], expenses: number[] } {
        const incomes = this.incomeService.getMonthlyIncomeTrends(user, months);
        const expenses = this.expenseService.getMonthlyExpenseTrends(user, months);

        return { income: incomes, expenses };
    }

    public getSavingsTrends(user: User, months: Date[]): number[] {
        const { income, expenses } = this.getIncomeVsExpenses(user, months);
        return income.map((inc, index) => inc - expenses[index]);
    }
}

export default AnalyticsService;