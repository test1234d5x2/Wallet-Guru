import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

// Validate JWT passed in.
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1]
        const jwtSecret = process.env.JWT_SECRET

        if (!jwtSecret) {
            res.status(500).json({ error: 'Unexpected Server Error. Please try again later.' })
            return
        }

        jwt.verify(token, jwtSecret, { algorithms: ['HS512'] }, (err, decoded) => {
            if (err) {
                res.status(403).json({ error: 'Invalid token' })
                return
            }

            next()
        })
    } else {
        res.status(401).json({ error: 'Authorization header missing' })
    }
}
