import User from "../models/core/User";
import UserRepository from "../repositories/UserRepository";

class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    public addUser(username: string, password: string): void {
        if (this.userExists(username)) {
            throw new Error("User already exists")
        }
        const user = new User(username, password);
        this.repository.add(user);
    }

    public deleteUser(id: string): void {
        this.repository.delete(id);
    }

    public authenticateUser(email: string, password: string): User | null {
        const user = this.repository.findByEmail(email);
        if (user && user.getPassword() === password) {
            return user;
        }
        return null;
    }

    public userExists(email: string): boolean {
        return this.repository.findByEmail(email) !== undefined;
    }

    public findByID(id: string): User | undefined {
        return this.repository.findById(id);
    }
}

export default UserService;
