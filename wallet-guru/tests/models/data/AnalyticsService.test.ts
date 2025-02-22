import User from '@/models/User';
import ExpenseCategoryService from '@/models/data/ExpenseCategoryService';
import IncomeService from '@/models/data/IncomeService';
import ExpenseService from '@/models/data/ExpenseService';
import AnalyticsService from '@/models/data/AnalyticsService';


describe('AnalyticsService', () => {
    let analyticsService: AnalyticsService;
    let expenseService: ExpenseService;
    let incomeService: IncomeService;
    let expenseCategoryService: ExpenseCategoryService;
    let user: User;

    beforeEach(() => {
        expenseService = new ExpenseService();
        incomeService = new IncomeService();
        expenseCategoryService = new ExpenseCategoryService();
        analyticsService = new AnalyticsService(expenseService, incomeService);
        user = new User('testuser@example.com', 'password123');
    });

    test('should get category distribution for a given month', () => {
        expenseCategoryService.addExpenseCategory(user, 'Food', 500);
        expenseCategoryService.addExpenseCategory(user, 'Travel', 1000);

        const foodCategory = expenseCategoryService.getAllCategoriesByUser(user).find(cat => cat.name === 'Food')!;
        const travelCategory = expenseCategoryService.getAllCategoriesByUser(user).find(cat => cat.name === 'Travel')!;

        expenseService.addExpense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', foodCategory);
        expenseService.addExpense(user, 'Snacks', 30, new Date(2023, 0, 2), 'Snacks expense', foodCategory);
        expenseService.addExpense(user, 'Flight', 200, new Date(2023, 0, 3), 'Travel expense', travelCategory);

        const distribution = analyticsService.getCategoryDistribution(user, new Date(2023, 0, 1));
        expect(distribution).toEqual([
            { name: 'Food', total: 80 },
            { name: 'Travel', total: 200 },
        ]);
    });

    test('should get income vs expenses for multiple months', () => {
        expenseCategoryService.addExpenseCategory(user, 'Food', 500);
        const foodCategory = expenseCategoryService.getAllCategoriesByUser(user).find(cat => cat.name === 'Food')!;

        incomeService.addIncome(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        incomeService.addIncome(user, 'Bonus', 500, new Date(2023, 1, 1), 'February bonus');
        expenseService.addExpense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', foodCategory);
        expenseService.addExpense(user, 'Snacks', 30, new Date(2023, 1, 2), 'Snacks expense', foodCategory);

        const result = analyticsService.getIncomeVsExpenses(user, [new Date(2023, 0, 1), new Date(2023, 1, 1)]);
        expect(result).toEqual({
            income: [3000, 500],
            expenses: [50, 30],
        });
    });

    test('should get savings trends for multiple months', () => {
        expenseCategoryService.addExpenseCategory(user, 'Food', 500);
        const foodCategory = expenseCategoryService.getAllCategoriesByUser(user).find(cat => cat.name === 'Food')!;

        incomeService.addIncome(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        incomeService.addIncome(user, 'Bonus', 500, new Date(2023, 1, 1), 'February bonus');
        expenseService.addExpense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', foodCategory);
        expenseService.addExpense(user, 'Snacks', 30, new Date(2023, 1, 2), 'Snacks expense', foodCategory);

        const savings = analyticsService.getSavingsTrends(user, [new Date(2023, 0, 1), new Date(2023, 1, 1)]);
        expect(savings).toEqual([2950, 470]);
    });

    test('should return zero savings if income equals expenses', () => {
        expenseCategoryService.addExpenseCategory(user, 'Travel', 1000);
        const travelCategory = expenseCategoryService.getAllCategoriesByUser(user).find(cat => cat.name === 'Travel')!;

        incomeService.addIncome(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        expenseService.addExpense(user, 'Flight', 3000, new Date(2023, 0, 1), 'Travel expense', travelCategory);

        const savings = analyticsService.getSavingsTrends(user, [new Date(2023, 0, 1)]);
        expect(savings).toEqual([0]);
    });

    test('should return negative savings if expenses exceed income', () => {
        expenseCategoryService.addExpenseCategory(user, 'Travel', 1000);
        const travelCategory = expenseCategoryService.getAllCategoriesByUser(user).find(cat => cat.name === 'Travel')!;

        incomeService.addIncome(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        expenseService.addExpense(user, 'Flight', 4000, new Date(2023, 0, 1), 'Travel expense', travelCategory);

        const savings = analyticsService.getSavingsTrends(user, [new Date(2023, 0, 1)]);
        expect(savings).toEqual([-1000]);
    });
});
