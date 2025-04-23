import jwt, { JwtPayload } from 'jsonwebtoken'

const getUserFromToken = (req: any): {email: string, userID: string} | undefined => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return
    }
    const token = authHeader.split(' ')[1]
    try {
        const jwtSecret = process.env.JWT_SECRET || 'your_default_secret'
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload
        const userID = decoded.userID
        const email = decoded.email
        if (userID) {
            return {userID, email}
        }
    } catch {
        return
    }
}

export default getUserFromToken
