import { Router } from 'express'
import verifyToken from '../utils/verifyToken'
import Registry from '../registry/Registry-new'
import getUserFromToken from '../utils/getUserFromToken'

const router = Router()

router.post('/', async (req, res) => {
    const authHeader = req.headers.authorization
    const { email } = req.body

    if (!authHeader) {
        res.status(401).json({ message: 'No token provided' })
        return
    }

    const token = authHeader.split(' ')[1]

    if (!token || !verifyToken(token)) {
        res.status(401).json({ message: 'Invalid or expired token' })
        return
    }

    const registry = await Registry.getInstance()
    const userService = registry.userService

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const userID = userDetails.userID

    const user = await userService.findByID(email, userID)
    if (!user) {
        res.status(401).json({ message: 'Invalid token' })
        return
    }

    if (email !== user.getEmail()) {
        res.status(401).json({ message: 'Unauthorised' })
        return
    }

    res.status(200).json({ message: 'Passed' })
})

export default router
