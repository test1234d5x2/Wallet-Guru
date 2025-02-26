import jwt, { JwtPayload } from "jsonwebtoken";


const getUserFromToken = (req: any): string | undefined => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return undefined;
    }
    const token = authHeader.split(" ")[1];
    try {
        const jwtSecret = process.env.JWT_SECRET || "your_default_secret";
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        const userID = decoded.userID;
        if (userID) {
            return userID
        }
    } catch (err) {
        return undefined;
    }
};

export default getUserFromToken;