import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        // Expected header format: "Bearer <token>"
        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET || "your_default_secret";
        
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Invalid token" });
            }

            next();
        });
    } else {
        res.status(401).json({ error: "Authorization header missing" });
    }
};
