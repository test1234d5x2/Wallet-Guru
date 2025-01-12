import ExpenseCategoryRepository from '@/models/data/ExpenseCategoryRepository';
import ExpenseCategory from '@/models/ExpenseCategory';
import User from '@/models/User';


describe('ExpenseCategoryRepository', () => {
    let repository: ExpenseCategoryRepository;
    let user: User;

    beforeEach(() => {
        repository = new ExpenseCategoryRepository();
        user = new User('testuser@example.com', 'password123');
    });

    test('should add a category successfully', () => {
        const category = new ExpenseCategory(user, 'Food', 500);
        repository.add(category);
        expect(repository.findByID(category.getID())).toEqual(category);
    });

    test('should throw an error when adding a duplicate category', () => {
        const category = new ExpenseCategory(user, 'Food', 500);
        repository.add(category);
        expect(() => repository.add(category)).toThrow('Category already exists');
    });

    test('should delete a category successfully', () => {
        const category = new ExpenseCategory(user, 'Food', 500);
        repository.add(category);
        repository.delete(category.getID());
        expect(() => repository.findByID(category.getID())).toThrow('Category not found');
    });

    test('should throw an error when deleting a non-existent category', () => {
        expect(() => repository.delete('nonexistent-id')).toThrow('Category not found');
    });

    test('should find categories by user ID', () => {
        const category1 = new ExpenseCategory(user, 'Food', 500);
        const category2 = new ExpenseCategory(user, 'Travel', 1000);
        repository.add(category1);
        repository.add(category2);
        const categories = repository.findByUser(user.getUserID());
        expect(categories).toEqual([category1, category2]);
    });

    test('should throw an error when finding a non-existent category by ID', () => {
        expect(() => repository.findByID('nonexistent-id')).toThrow('Category not found');
    });
});
