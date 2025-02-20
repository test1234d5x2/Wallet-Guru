import User from "../models/User";

class UserRepository {
    private users: User[] = [];

    public add(user: User): void {
        const exists = this.users.some(u => u.getUserID() === user.getUserID());
        if (exists) {
            throw new Error(`User already exists`);
        }
        this.users.push(user);
    }

    public delete(id: string): void {
        const index = this.users.findIndex(u => u.getUserID() === id);
        if (index === -1) {
            throw new Error(`User not found`);
        }
        this.users.splice(index, 1);
    }

    public findById(id: string): User | undefined {
        return this.users.find(u => u.getUserID() === id);
    }

    public findByEmail(email: string): User | undefined {
        return this.users.find(u => u.getEmail() === email);
    }
}

export default UserRepository;
