import IncomeService from '@/models/data/IncomeService';
import User from '@/models/User';

describe('IncomeService', () => {
    let service: IncomeService;
    let user: User;

    beforeEach(() => {
        service = new IncomeService();
        user = new User('testuser@example.com', 'password123');
    });

    test('should add an income successfully', () => {
        service.addIncome(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        const incomes = service.getAllIncomesByUser(user);
        expect(incomes).toHaveLength(1);
        expect(incomes[0].title).toBe('Salary');
    });

    test('should update an income successfully', () => {
        service.addIncome(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        const income = service.getAllIncomesByUser(user)[0];
        service.updateIncome(income.getID(), 'Updated Salary', 3500, new Date(2023, 0, 1), 'Updated January salary');
        const updatedIncome = service.getAllIncomesByUser(user)[0];
        expect(updatedIncome.title).toBe('Updated Salary');
        expect(updatedIncome.amount).toBe(3500);
    });

    test('should throw an error when updating a non-existent income', () => {
        expect(() =>
            service.updateIncome('nonexistent-id', 'Salary', 3000, new Date(2023, 0, 1), 'January salary')
        ).toThrow('Income does not exist');
    });

    test('should delete an income successfully', () => {
        service.addIncome(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        const income = service.getAllIncomesByUser(user)[0];
        service.deleteIncome(income.getID());
        const incomes = service.getAllIncomesByUser(user);
        expect(incomes).toHaveLength(0);
    });

    test('should throw an error when deleting a non-existent income', () => {
        expect(() => service.deleteIncome('nonexistent-id')).toThrow('Income not found');
    });

    test('should calculate monthly transactions total', () => {
        service.addIncome(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        service.addIncome(user, 'Bonus', 500, new Date(2023, 0, 15), 'January bonus');
        const total = service.calculateMonthlyTransactionsTotal(user, new Date(2023, 0, 1));
        expect(total).toBe(3500);
    });

    test('should return 0 for a month with no transactions', () => {
        const total = service.calculateMonthlyTransactionsTotal(user, new Date(2023, 0, 1));
        expect(total).toBe(0);
    });

    test('should get monthly income trends for multiple months', () => {
        service.addIncome(user, 'Salary', 3000, new Date(2023, 0, 1), 'January salary');
        service.addIncome(user, 'Bonus', 500, new Date(2023, 0, 15), 'January bonus');
        service.addIncome(user, 'Consulting', 2000, new Date(2023, 1, 5), 'February income');
        const trends = service.getMonthlyIncomeTrends(user, [new Date(2023, 0, 1), new Date(2023, 1, 1)]);
        expect(trends).toEqual([3500, 2000]);
    });

    test('should return an empty array for no months provided', () => {
        const trends = service.getMonthlyIncomeTrends(user, []);
        expect(trends).toEqual([]);
    });
});
