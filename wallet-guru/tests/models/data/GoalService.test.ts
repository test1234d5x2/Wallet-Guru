import User from '@/models/User';
import GoalStatus from '@/enums/GoalStatus';
import GoalService from '@/models/data/GoalService';


describe('GoalService', () => {
    let service: GoalService;
    let user: User;

    beforeEach(() => {
        service = new GoalService();
        user = new User('testuser@example.com', 'password123');
    });

    test('should add a goal successfully', () => {
        service.addGoal(user, 'Save for Vacation', 'Save $5000 for a vacation', 5000, GoalStatus.Active);
        const goals = service.getAllGoalsByUser(user);
        expect(goals).toHaveLength(1);
        expect(goals[0].title).toBe('Save for Vacation');
    });

    test('should update a goal successfully', () => {
        service.addGoal(user, 'Save for Vacation', 'Save $5000 for a vacation', 5000, GoalStatus.Active);
        const goal = service.getAllGoalsByUser(user)[0];
        service.updateGoal(goal.getID(), 'Save for Car', 'Save $10000 for a car', 10000, 0, GoalStatus.Active);
        const updatedGoal = service.getAllGoalsByUser(user)[0];
        expect(updatedGoal.title).toBe('Save for Car');
        expect(updatedGoal.target).toBe(10000);
    });

    test('should throw an error when updating a non-existent goal', () => {
        expect(() =>
            service.updateGoal('nonexistent-id', 'Save for Car', 'Save $10000 for a car', 10000, 0, GoalStatus.Active)
        ).toThrow('Goal does not exist');
    });

    test('should delete a goal successfully', () => {
        service.addGoal(user, 'Save for Vacation', 'Save $5000 for a vacation', 5000, GoalStatus.Active);
        const goal = service.getAllGoalsByUser(user)[0];
        service.deleteGoal(goal.getID());
        const goals = service.getAllGoalsByUser(user);
        expect(goals).toHaveLength(0);
    });

    test('should throw an error when deleting a non-existent goal', () => {
        expect(() => service.deleteGoal('nonexistent-id')).toThrow('Goal not found');
    });

    test('should get all goals by user', () => {
        service.addGoal(user, 'Save for Vacation', 'Save $5000 for a vacation', 5000, GoalStatus.Active);
        service.addGoal(user, 'Save for Car', 'Save $10000 for a car', 10000, GoalStatus.Active);
        const goals = service.getAllGoalsByUser(user);
        expect(goals).toHaveLength(2);
        expect(goals[0].title).toBe('Save for Vacation');
        expect(goals[1].title).toBe('Save for Car');
    });

    test('should return an empty array if user has no goals', () => {
        const goals = service.getAllGoalsByUser(user);
        expect(goals).toHaveLength(0);
    });
});
