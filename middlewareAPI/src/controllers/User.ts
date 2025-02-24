import { RequestHandler } from "express";
import Registry from "../registry/Registry";

const registry = Registry.getInstance();
const userService = registry.userService;
const authService = registry.authService;

/**
 * Create a new user.
 * Uses registry.userService.addUser after checking that the user doesn't already exist.
 */
export const create: RequestHandler = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required", message: "Username and password are required" });
        return;
    }

    if (userService.userExists(username)) {
        res.status(400).json({ error: "User already exists", message: "User already exists." });
        return;
    }
    
    userService.addUser(username, password);
    res.status(201).json({ message: "User created" });
};

/**
 * Authenticate a user.
 * Calls registry.userService.authenticateUser to verify credentials.
 */
export const login: RequestHandler = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
    }

    const token = authService.authenticate(username, password);
    res.status(200).json({ message: "Login successful", token: token });
};


/**
 * Delete a user.
 * Calls registry.userService.deleteUser using the user id from the URL parameters.
 */
export const remove: RequestHandler = (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: "User ID is required", message: "User ID is required." });
        return;
    }

    userService.deleteUser(id);
    res.status(200).json({ message: "User deleted" });
};
