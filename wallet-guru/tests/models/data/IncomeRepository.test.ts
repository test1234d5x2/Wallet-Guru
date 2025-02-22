import IncomeRepository from '@/models/data/IncomeRepository';
import Income from '@/models/Income';
import User from '@/models/User';


describe('IncomeRepository', () => {
    let repository: IncomeRepository;
    let user: User;

    beforeEach(() => {
        repository = new IncomeRepository();
        user = new User('testuser@example.com', 'password123');
    });

    test('should add an income successfully', () => {
        const income = new Income(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        repository.add(income);
        expect(repository.findById(income.getID())).toEqual(income);
    });

    test('should throw an error when adding a duplicate income', () => {
        const income = new Income(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        repository.add(income);
        expect(() => repository.add(income)).toThrow('Income already exists');
    });

    test('should delete an income successfully', () => {
        const income = new Income(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        repository.add(income);
        repository.delete(income.getID());
        expect(repository.findById(income.getID())).toBeUndefined();
    });

    test('should throw an error when deleting a non-existent income', () => {
        expect(() => repository.delete('nonexistent-id')).toThrow('Income not found');
    });

    test('should find incomes by user ID', () => {
        const income1 = new Income(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        const income2 = new Income(user, 'Bonus', 500, new Date(2023, 0, 5), 'January bonus');
        repository.add(income1);
        repository.add(income2);
        const foundIncomes = repository.findByUser(user.getUserID());
        expect(foundIncomes).toEqual([income1, income2]);
    });

    test('should return undefined when finding a non-existent income by ID', () => {
        const income = repository.findById('nonexistent-id');
        expect(income).toBeUndefined();
    });
});
