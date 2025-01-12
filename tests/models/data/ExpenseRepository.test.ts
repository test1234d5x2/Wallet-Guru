import Expense from '@/models/Expense';
import ExpenseCategory from '@/models/ExpenseCategory';
import User from '@/models/User';
import ExpenseRepository from '@/models/data/ExpenseRepository';


describe('ExpenseRepository', () => {
    let repository: ExpenseRepository;
    let user: User;
    let category: ExpenseCategory;

    beforeEach(() => {
        repository = new ExpenseRepository();
        user = new User('testuser@example.com', 'password123');
        category = new ExpenseCategory(user, 'Food', 500);
    });

    test('should add an expense successfully', () => {
        const expense = new Expense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        repository.add(expense);
        expect(repository.findById(expense.getID())).toEqual(expense);
    });

    test('should throw an error when adding a duplicate expense', () => {
        const expense = new Expense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        repository.add(expense);
        expect(() => repository.add(expense)).toThrow('Expense already exists');
    });

    test('should delete an expense successfully', () => {
        const expense = new Expense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        repository.add(expense);
        repository.delete(expense.getID());
        expect(repository.findById(expense.getID())).toBeUndefined();
    });

    test('should throw an error when deleting a non-existent expense', () => {
        expect(() => repository.delete('nonexistent-id')).toThrow('Expense not found');
    });

    test('should find expenses by user ID', () => {
        const expense1 = new Expense(user, 'Lunch', 50, new Date(2023, 0, 1), 'Lunch expense', category);
        const expense2 = new Expense(user, 'Dinner', 80, new Date(2023, 0, 2), 'Dinner expense', category);
        repository.add(expense1);
        repository.add(expense2);
        const expenses = repository.findByUser(user.getUserID());
        expect(expenses).toEqual([expense1, expense2]);
    });

    test('should return undefined when finding a non-existent expense by ID', () => {
        const expense = repository.findById('nonexistent-id');
        expect(expense).toBeUndefined();
    });
});
