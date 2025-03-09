import jwt from "jsonwebtoken";

const verifyToken = (token: string): boolean => {
    try {
        const jwtSecret = process.env.JWT_SECRET || "your_default_secret";
        jwt.verify(token, jwtSecret, { ignoreExpiration: false });
        return true;
    } catch (err) {
        return false;
    }
};

export default verifyToken;
