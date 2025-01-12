import filterExpensesByCategory from '@/utils/filterExpensesByCategory';
import User from '@/models/User';
import UserStatus from '@/enums/UserStatus';
import ExpenseService from '@/models/data/ExpenseService';
import ExpenseCategoryService from '@/models/data/ExpenseCategoryService';
import Expense from '@/models/Expense';

describe('filterExpensesByCategory', () => {
    let expenseService: ExpenseService;
    let expenseCategoryService: ExpenseCategoryService;
    const mockUser = new User('testuser@example.com', 'password123');

    beforeEach(() => {
        mockUser.setUserStatus(UserStatus.VERIFIED);
        expenseService = new ExpenseService();
        expenseCategoryService = new ExpenseCategoryService();
    });

    test('should return expenses matching the specified category', () => {
        expenseCategoryService.addExpenseCategory(mockUser, 'Food', 500);
        const foodCategory = expenseCategoryService.getAllCategoriesByUser(mockUser)[0];
        expenseService.addExpense(mockUser, 'Groceries', 100, new Date(2023, 0, 15), 'Bought groceries', foodCategory);
        expenseService.addExpense(mockUser, 'Snacks', 50, new Date(2023, 0, 20), 'Bought snacks', foodCategory);

        const expenses = expenseService.getAllExpensesByUser(mockUser);
        const result = filterExpensesByCategory(expenses, foodCategory);

        expect(result).toEqual(expenses);
    });

    test('should return an empty array if no expenses match the specified category', () => {
        expenseCategoryService.addExpenseCategory(mockUser, 'Food', 500);
        expenseCategoryService.addExpenseCategory(mockUser, 'Travel', 1000);
        const travelCategory = expenseCategoryService.getAllCategoriesByUser(mockUser).find(cat => cat.name === 'Travel')!;
        expenseService.addExpense(mockUser, 'Flight', 300, new Date(2023, 1, 15), 'Travel expense', travelCategory);

        const expenses = expenseService.getAllExpensesByUser(mockUser);
        const foodCategory = expenseCategoryService.getAllCategoriesByUser(mockUser).find(cat => cat.name === 'Food')!;
        const result = filterExpensesByCategory(expenses, foodCategory);

        expect(result).toEqual([]);
    });

    test('should handle an empty expenses array', () => {
        expenseCategoryService.addExpenseCategory(mockUser, 'Food', 500);
        const foodCategory = expenseCategoryService.getAllCategoriesByUser(mockUser)[0];

        const expenses: Expense[] = [];
        const result = filterExpensesByCategory(expenses, foodCategory);

        expect(result).toEqual([]);
    });

    test('should return all expenses for the same category', () => {
        expenseCategoryService.addExpenseCategory(mockUser, 'Utilities', 300);
        const utilitiesCategory = expenseCategoryService.getAllCategoriesByUser(mockUser)[0];
        expenseService.addExpense(mockUser, 'Electricity', 150, new Date(2023, 2, 5), 'Electricity bill', utilitiesCategory);
        expenseService.addExpense(mockUser, 'Water', 50, new Date(2023, 2, 10), 'Water bill', utilitiesCategory);

        const expenses = expenseService.getAllExpensesByUser(mockUser);
        const result = filterExpensesByCategory(expenses, utilitiesCategory);

        expect(result).toEqual(expenses);
    });

    test('should handle expenses belonging to multiple categories', () => {
        expenseCategoryService.addExpenseCategory(mockUser, 'Food', 500);
        expenseCategoryService.addExpenseCategory(mockUser, 'Travel', 1000);
        const foodCategory = expenseCategoryService.getAllCategoriesByUser(mockUser).find(cat => cat.name === 'Food')!;
        const travelCategory = expenseCategoryService.getAllCategoriesByUser(mockUser).find(cat => cat.name === 'Travel')!;
        expenseService.addExpense(mockUser, 'Groceries', 100, new Date(2023, 0, 15), 'Bought groceries', foodCategory);
        expenseService.addExpense(mockUser, 'Flight', 300, new Date(2023, 1, 15), 'Travel expense', travelCategory);

        const expenses = expenseService.getAllExpensesByUser(mockUser);
        const result = filterExpensesByCategory(expenses, foodCategory);

        expect(result).toEqual([
            expenses.find(expense => expense.title === 'Groceries'),
        ]);
    });
});
