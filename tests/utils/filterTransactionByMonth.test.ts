import filterTransactionByMonth from '@/utils/filterTransactionByMonth';
import User from '@/models/User';
import UserStatus from '@/enums/UserStatus';
import IncomeService from '@/models/data/IncomeService';
import ExpenseCategoryService from '@/models/data/ExpenseCategoryService';
import ExpenseService from '@/models/data/ExpenseService';
import Transaction from '@/models/Transaction';

describe('filterTransactionByMonth', () => {
    let incomeService: IncomeService;
    let expenseService: ExpenseService;
    let expenseCategoryService: ExpenseCategoryService;
    const mockUser = new User('testuser@example.com', 'password123');

    beforeEach(() => {
        mockUser.setUserStatus(UserStatus.VERIFIED);
        incomeService = new IncomeService();
        expenseService = new ExpenseService();
        expenseCategoryService = new ExpenseCategoryService();
    });

    test('should return transactions for the specified month and year', () => {
        expenseCategoryService.addExpenseCategory(mockUser, 'Food', 500);
        const foodCategory = expenseCategoryService.getAllCategoriesByUser(mockUser)[0];

        incomeService.addIncome(mockUser, 'Salary', 2000, new Date(2023, 1, 1), 'January salary');
        expenseService.addExpense(mockUser, 'Groceries', 100, new Date(2023, 0, 15), 'Bought groceries', foodCategory);
        expenseService.addExpense(mockUser, 'Snacks', 50, new Date(2023, 0, 20), 'Bought snacks', foodCategory);

        const transactions = [
            ...expenseService.getAllExpensesByUser(mockUser),
            ...incomeService.getAllIncomesByUser(mockUser),
        ];

        const targetMonth = new Date(2023, 0, 1);

        const result = filterTransactionByMonth(transactions, targetMonth);

        expect(result).toEqual([
            transactions[0],
            transactions[1],
        ]);
    });

    test('should return an empty array if no transactions match the specified month and year', () => {
        expenseCategoryService.addExpenseCategory(mockUser, 'Travel', 1000);
        const travelCategory = expenseCategoryService.getAllCategoriesByUser(mockUser)[0];

        incomeService.addIncome(mockUser, 'Bonus', 500, new Date(2023, 2, 1), 'March bonus');
        expenseService.addExpense(mockUser, 'Dinner', 80, new Date(2023, 1, 15), 'Valentine dinner', travelCategory);

        const transactions = [
            ...expenseService.getAllExpensesByUser(mockUser),
            ...incomeService.getAllIncomesByUser(mockUser),
        ];

        const targetMonth = new Date(2023, 0, 1);

        const result = filterTransactionByMonth(transactions, targetMonth);

        expect(result).toEqual([]);
    });

    test('should handle an empty transactions array', () => {
        const transactions: Transaction[] = [];

        const targetMonth = new Date(2023, 0, 1);

        const result = filterTransactionByMonth(transactions, targetMonth);

        expect(result).toEqual([]);
    });

    test('should return all transactions for the same month and year', () => {
        expenseCategoryService.addExpenseCategory(mockUser, 'Rent', 1500);
        const rentCategory = expenseCategoryService.getAllCategoriesByUser(mockUser)[0];

        incomeService.addIncome(mockUser, 'Consulting', 3000, new Date(2023, 3, 10), 'Consulting payment');
        incomeService.addIncome(mockUser, 'Freelance', 500, new Date(2023, 3, 20), 'Freelance gig');
        expenseService.addExpense(mockUser, 'Rent', 1500, new Date(2023, 3, 1), 'April rent', rentCategory);

        const transactions = [
            ...expenseService.getAllExpensesByUser(mockUser),
            ...incomeService.getAllIncomesByUser(mockUser),
        ];

        const targetMonth = new Date(2023, 3, 1);

        const result = filterTransactionByMonth(transactions, targetMonth);

        expect(result).toEqual(transactions);
    });

    test('should handle transactions with dates in different years but the same month', () => {
        expenseCategoryService.addExpenseCategory(mockUser, 'Food', 500);
        const foodCategory = expenseCategoryService.getAllCategoriesByUser(mockUser)[0];

        incomeService.addIncome(mockUser, 'Salary 2023', 2500, new Date(2023, 0, 15), 'January 2023 salary');
        expenseService.addExpense(mockUser, 'Groceries 2022', 80, new Date(2022, 0, 15), 'January groceries', foodCategory);

        const transactions = [
            ...expenseService.getAllExpensesByUser(mockUser),
            ...incomeService.getAllIncomesByUser(mockUser),
        ];

        const targetMonth = new Date(2023, 0, 1);

        const result = filterTransactionByMonth(transactions, targetMonth);

        expect(result).toEqual([
            transactions[1],
        ]);
    });
});
