import ExpenseCategoryService from '@/models/data/ExpenseCategoryService';
import User from '@/models/User';


describe('ExpenseCategoryService', () => {
    let service: ExpenseCategoryService;
    let user: User;

    beforeEach(() => {
        service = new ExpenseCategoryService();
        user = new User('testuser@example.com', 'password123');
    });

    test('should add a category successfully', () => {
        service.addExpenseCategory(user, 'Food', 500);
        const categories = service.getAllCategoriesByUser(user);
        expect(categories).toHaveLength(1);
        expect(categories[0].name).toBe('Food');
    });

    test('should update a category successfully', () => {
        service.addExpenseCategory(user, 'Food', 500);
        const category = service.getAllCategoriesByUser(user)[0];
        service.updateExpenseCategory(category.getID(), 'Groceries', 700);
        const updatedCategory = service.getAllCategoriesByUser(user)[0];
        expect(updatedCategory.name).toBe('Groceries');
        expect(updatedCategory.monthlyBudget).toBe(700);
    });

    test('should throw an error when updating a non-existent category', () => {
        expect(() => service.updateExpenseCategory('nonexistent-id', 'Groceries', 700)).toThrow('Category not found');
    });

    test('should delete a category successfully', () => {
        service.addExpenseCategory(user, 'Food', 500);
        const category = service.getAllCategoriesByUser(user)[0];
        service.deleteExpenseCategory(category.getID());
        const categories = service.getAllCategoriesByUser(user);
        expect(categories).toHaveLength(0);
    });

    test('should throw an error when deleting a non-existent category', () => {
        expect(() => service.deleteExpenseCategory('nonexistent-id')).toThrow('Category not found');
    });

    test('should get all categories by user', () => {
        service.addExpenseCategory(user, 'Food', 500);
        service.addExpenseCategory(user, 'Travel', 1000);
        const categories = service.getAllCategoriesByUser(user);
        expect(categories).toHaveLength(2);
        expect(categories[0].name).toBe('Food');
        expect(categories[1].name).toBe('Travel');
    });

    test('should get all categories by user and name', () => {
        service.addExpenseCategory(user, 'Food', 500);
        service.addExpenseCategory(user, 'Travel', 1000);
        const categories = service.getAllCategoriesByUserAndName(user, 'food');
        expect(categories).toHaveLength(1);
        expect(categories[0].name).toBe('Food');
    });

    test('should return an empty array if no categories match the name', () => {
        service.addExpenseCategory(user, 'Food', 500);
        const categories = service.getAllCategoriesByUserAndName(user, 'nonexistent');
        expect(categories).toHaveLength(0);
    });
});
