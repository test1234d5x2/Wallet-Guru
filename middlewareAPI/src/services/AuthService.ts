import jwt from "jsonwebtoken";
import UserService from "./UserService";
import dotenv from "dotenv";
dotenv.config();

class AuthService {
    private userService: UserService;
    private JWTSecret: string;

    constructor(userService: UserService) {
        this.userService = userService;
        this.JWTSecret = process.env.JWT_SECRET || "";
    }

    public authenticate(email: string, password: string): string {
        const user = this.userService.authenticateUser(email, password);
        if (!user) {
            throw new Error("Invalid credentials");
        };

        if (this.JWTSecret === "") {
            throw new Error("Server Error");
        }

        const paylod = { userID: user.getUserID() };

        const token = jwt.sign(paylod, this.JWTSecret, { expiresIn: "12h", algorithm: "HS512"});
        return token;
    }
}

export default AuthService;
