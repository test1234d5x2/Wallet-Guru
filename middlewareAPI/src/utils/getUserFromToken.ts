import Registry from "../registry/Registry";
import jwt from "jsonwebtoken";


const getUserFromToken = (req: any): any | null => {
    const registry = Registry.getInstance();
    const userService = registry.userService;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    try {
        const jwtSecret = process.env.JWT_SECRET || "your_default_secret";
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        const user = userService.findByID(decoded.userId);
        return user;
    } catch (err) {
        return null;
    }
};

export default getUserFromToken;