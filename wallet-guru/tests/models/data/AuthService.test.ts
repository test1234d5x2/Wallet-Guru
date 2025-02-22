import User from '@/models/User';
import AuthService from '@/models/data/AuthService';
import UserService from '@/models/data/UserService';

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let user: User;

    beforeEach(() => {
        userService = new UserService();
        authService = new AuthService(userService);
        user = new User('testuser@example.com', 'password123');
        userService.addUser(user.getEmail(), user.getPassword());
    });

    test('should authenticate a user with valid credentials', () => {
        const result = authService.authenticate('testuser@example.com', 'password123');
        expect(result).toBe(true);
        expect(authService.getAuthenticatedUser()?.getEmail()).toBe('testuser@example.com');
    });

    test('should not authenticate a user with invalid credentials', () => {
        const result = authService.authenticate('testuser@example.com', 'wrongpassword');
        expect(result).toBe(false);
        expect(authService.getAuthenticatedUser()).toBeNull();
    });

    test('should return null when no user is authenticated', () => {
        expect(authService.getAuthenticatedUser()).toBeNull();
    });

    test('should check if a user is authenticated', () => {
        authService.authenticate('testuser@example.com', 'password123');
        expect(authService.isAuthenticated()).toBe(true);
        authService.logout();
        expect(authService.isAuthenticated()).toBe(false);
    });

    test('should logout an authenticated user', () => {
        authService.authenticate('testuser@example.com', 'password123');
        authService.logout();
        expect(authService.getAuthenticatedUser()).toBeNull();
    });
});
