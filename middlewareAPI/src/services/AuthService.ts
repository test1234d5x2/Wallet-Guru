import jwt from "jsonwebtoken";
import UserService from "./UserService";

class AuthService {
    private userService: UserService;
    private JWTSecret: string;

    constructor(userService: UserService) {
        this.userService = userService;
        this.JWTSecret = process.env.JWT_SECRET || "your_default_secret";
    }

    public authenticate(email: string, password: string): string {
        const user = this.userService.authenticateUser(email, password);
        if (!user) {
            throw new Error("Invalid credentials");
        };

        const paylod = { userID: user.getUserID() };

        const token = jwt.sign(paylod, this.JWTSecret, { expiresIn: "12h", algorithm: "HS512"});
        return token;
    }

    public logout(): void {
        // May need changing.
        return;
    }
}

export default AuthService;
