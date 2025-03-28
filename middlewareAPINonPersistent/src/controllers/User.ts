import { RequestHandler } from "express"
import Registry from "../registry/Registry"
import getUserFromToken from "../utils/getUserFromToken"

const registry = Registry.getInstance()
const userService = registry.userService
const authService = registry.authService

export const create: RequestHandler = (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required", message: "Username and password are required" })
        return
    }

    if (userService.userExists(username)) {
        res.status(400).json({ error: "User already exists", message: "User already exists." })
        return
    }

    userService.addUser(username, password)
    res.status(201).json({ message: "User created" })
}

export const login: RequestHandler = (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" })
        return
    }

    const token = authService.authenticate(username, password)
    res.status(200).json({ message: "Login successful", token: token })
}

export const remove: RequestHandler = (req, res) => {
    const { email } = req.body

    if (!email) {
        res.status(400).json({ error: "Email is required." })
        return
    }

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to perform this action." })
        return
    }

    const user = userService.findByID(userID)

    if (!user) {
        res.status(401).json({ error: "You must be logged in to perform this action." })
        return
    }

    if (user.getEmail() !== email) {
        res.status(401).json({ error: "You must be logged in to perform this action." })
        return
    }

    userService.deleteUser(userID)
    res.status(200).json({ error: "User deleted" })
}
