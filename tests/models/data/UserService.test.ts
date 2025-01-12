import UserService from "@/models/data/UserService";


describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        service = new UserService();
    });

    test('should add a user successfully', () => {
        service.addUser('testuser@example.com', 'password123');
        expect(service.userExists('testuser@example.com')).toBe(true);
    });

    test('should throw an error when adding a duplicate user', () => {
        service.addUser('testuser@example.com', 'password123');
        expect(() => service.addUser('testuser@example.com', 'password123')).toThrow('User already exists');
    });

    test('should delete a user successfully', () => {
        service.addUser('testuser@example.com', 'password123');
        const user = service.authenticateUser('testuser@example.com', 'password123');
        service.deleteUser(user!.getUserID());
        expect(service.userExists('testuser@example.com')).toBe(false);
    });

    test('should throw an error when deleting a non-existent user', () => {
        expect(() => service.deleteUser('nonexistent-id')).toThrow('User not found');
    });

    test('should authenticate a user with correct credentials', () => {
        service.addUser('testuser@example.com', 'password123');
        const user = service.authenticateUser('testuser@example.com', 'password123');
        expect(user).not.toBeNull();
        expect(user?.getEmail()).toBe('testuser@example.com');
    });

    test('should not authenticate a user with incorrect password', () => {
        service.addUser('testuser@example.com', 'password123');
        const user = service.authenticateUser('testuser@example.com', 'wrongpassword');
        expect(user).toBeNull();
    });

    test('should not authenticate a non-existent user', () => {
        const user = service.authenticateUser('nonexistent@example.com', 'password123');
        expect(user).toBeNull();
    });

    test('should check if a user exists', () => {
        service.addUser('testuser@example.com', 'password123');
        expect(service.userExists('testuser@example.com')).toBe(true);
        expect(service.userExists('nonexistent@example.com')).toBe(false);
    });
});
