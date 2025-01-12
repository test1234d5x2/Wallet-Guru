import UserRepository from '@/models/data/UserRepository';
import User from '@/models/User';


describe('UserRepository', () => {
    let repository: UserRepository;

    beforeEach(() => {
        repository = new UserRepository();
    });

    test('should add a user successfully', () => {
        const user = new User('testuser@example.com', 'password123');

        repository.add(user);

        expect(repository.findById(user.getUserID())).toEqual(user);
    });

    test('should throw an error when adding a duplicate user', () => {
        const user = new User('testuser@example.com', 'password123');

        repository.add(user);

        expect(() => repository.add(user)).toThrow('User already exists');
    });

    test('should delete a user successfully', () => {
        const user = new User('testuser@example.com', 'password123');

        repository.add(user);
        repository.delete(user.getUserID());

        expect(repository.findById(user.getUserID())).toBeUndefined();
    });

    test('should throw an error when trying to delete a non-existent user', () => {
        expect(() => repository.delete('nonexistent-id')).toThrow('User not found');
    });

    test('should find a user by ID', () => {
        const user = new User('testuser@example.com', 'password123');

        repository.add(user);

        const foundUser = repository.findById(user.getUserID());

        expect(foundUser).toEqual(user);
    });

    test('should return undefined when finding a non-existent user by ID', () => {
        const foundUser = repository.findById('nonexistent-id');

        expect(foundUser).toBeUndefined();
    });

    test('should find a user by email', () => {
        const user = new User('testuser@example.com', 'password123');

        repository.add(user);

        const foundUser = repository.findByEmail('testuser@example.com');

        expect(foundUser).toEqual(user);
    });

    test('should return undefined when finding a non-existent user by email', () => {
        const foundUser = repository.findByEmail('nonexistent@example.com');

        expect(foundUser).toBeUndefined();
    });
});
