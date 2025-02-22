import Goal from '@/models/Goal';
import User from '@/models/User';
import GoalStatus from '@/enums/GoalStatus';
import GoalRepository from '@/models/data/GoalRepository';


describe('GoalRepository', () => {
    let repository: GoalRepository;
    let user: User;

    beforeEach(() => {
        repository = new GoalRepository();
        user = new User('testuser@example.com', 'password123');
    });

    test('should add a goal successfully', () => {
        const goal = new Goal('Save for Vacation', user, 'Save $5000 for a vacation', 5000, GoalStatus.Active);
        repository.add(goal);
        expect(repository.findById(goal.getID())).toEqual(goal);
    });

    test('should throw an error when adding a duplicate goal', () => {
        const goal = new Goal('Save for Vacation', user, 'Save $5000 for a vacation', 5000, GoalStatus.Active);
        repository.add(goal);
        expect(() => repository.add(goal)).toThrow('Goal already exists');
    });

    test('should delete a goal successfully', () => {
        const goal = new Goal('Save for Vacation', user, 'Save $5000 for a vacation', 5000, GoalStatus.Active);
        repository.add(goal);
        repository.delete(goal.getID());
        expect(repository.findById(goal.getID())).toBeUndefined();
    });

    test('should throw an error when deleting a non-existent goal', () => {
        expect(() => repository.delete('nonexistent-id')).toThrow('Goal not found');
    });

    test('should find goals by user ID', () => {
        const goal1 = new Goal('Save for Vacation', user, 'Save $5000 for a vacation', 5000, GoalStatus.Active);
        const goal2 = new Goal('Save for Car', user, 'Save $10000 for a car', 10000, GoalStatus.Active);
        repository.add(goal1);
        repository.add(goal2);
        const goals = repository.findByUser(user.getUserID());
        expect(goals).toEqual([goal1, goal2]);
    });

    test('should return undefined when finding a non-existent goal by ID', () => {
        const goal = repository.findById('nonexistent-id');
        expect(goal).toBeUndefined();
    });
});
