import ExpenseService from '@/models/data/ExpenseService';
import ExpenseCategory from '@/models/ExpenseCategory';
import User from '@/models/User';


describe('ExpenseService', () => {
    let service: ExpenseService;
    let user: User;
    let category: ExpenseCategory;

    beforeEach(() => {
        service = new ExpenseService();
        user = new User('testuser@example.com', 'password123');
        category = new ExpenseCategory(user, 'Food', 500);
    });

    test('should add an expense successfully', () => {
        service.addExpense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        const expenses = service.getAllExpensesByUser(user);
        expect(expenses).toHaveLength(1);
        expect(expenses[0].title).toBe('Lunch');
    });

    test('should update an expense successfully', () => {
        service.addExpense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        const expense = service.getAllExpensesByUser(user)[0];
        service.updateExpense(expense.getID(), 'Dinner', 80, new Date(2023, 0, 2), 'Dinner expense', category);
        const updatedExpense = service.getAllExpensesByUser(user)[0];
        expect(updatedExpense.title).toBe('Dinner');
        expect(updatedExpense.amount).toBe(80);
    });

    test('should throw an error when updating a non-existent expense', () => {
        expect(() =>
            service.updateExpense('nonexistent-id', 'Dinner', 80, new Date(2023, 0, 2), 'Dinner expense', category)
        ).toThrow('The expense does not exist');
    });

    test('should delete an expense successfully', () => {
        service.addExpense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        const expense = service.getAllExpensesByUser(user)[0];
        service.deleteExpense(expense.getID());
        const expenses = service.getAllExpensesByUser(user);
        expect(expenses).toHaveLength(0);
    });

    test('should calculate monthly transactions total', () => {
        service.addExpense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        service.addExpense(user, 'Dinner', 80, new Date(2023, 0, 2), 'Dinner expense', category);
        const total = service.calculateMonthlyTransactionsTotal(user, new Date(2023, 0, 1));
        expect(total).toBe(130);
    });

    test('should return 0 for a month with no transactions', () => {
        const total = service.calculateMonthlyTransactionsTotal(user, new Date(2023, 0, 1));
        expect(total).toBe(0);
    });

    test('should get monthly expense trends for multiple months', () => {
        service.addExpense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        service.addExpense(user, 'Dinner', 80, new Date(2023, 0, 2), 'Dinner expense', category);
        service.addExpense(user, 'Snacks', 30, new Date(2023, 1, 5), 'Snacks expense', category);
        const trends = service.getMonthlyExpenseTrends(user, [new Date(2023, 0, 1), new Date(2023, 1, 1)]);
        expect(trends).toEqual([130, 30]);
    });

    test('should calculate monthly category total', () => {
        service.addExpense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        service.addExpense(user, 'Dinner', 80, new Date(2023, 0, 2), 'Dinner expense', category);
        const total = service.calculateMonthlyCategoryTotal(user, new Date(2023, 0, 1), category);
        expect(total).toBe(130);
    });

    test('should get total expenses by category', () => {
        const travelCategory = new ExpenseCategory(user, 'Travel', 1000);
        service.addExpense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        service.addExpense(user, 'Snacks', 30, new Date(2023, 0, 2), 'Snacks expense', category);
        service.addExpense(user, 'Flight', 200, new Date(2023, 0, 3), 'Travel expense', travelCategory);
        const totals = service.getTotalExpensesByCategory(user, new Date(2023, 0, 1));
        expect(totals).toEqual({ Food: 80, Travel: 200 });
    });
});
