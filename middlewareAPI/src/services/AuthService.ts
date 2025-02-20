import User from "../models/User";
import UserService from "./UserService";

class AuthService {
    private authenticatedUser: User | null = null;
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public authenticate(email: string, password: string): boolean {
        const user = this.userService.authenticateUser(email, password);
        if (user) {
            this.authenticatedUser = user;
            return true;
        }
        return false;
    }

    public getAuthenticatedUser(): User | null {
        return this.authenticatedUser;
    }

    public isAuthenticated(): boolean {
        return this.authenticatedUser !== null;
    }

    public logout(): void {
        this.authenticatedUser = null;
    }
}

export default AuthService;
