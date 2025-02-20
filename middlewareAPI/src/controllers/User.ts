import { RequestHandler } from "express";
import Registry from "../registry/Registry";

const registry = Registry.getInstance();

/**
 * Create a new user.
 * Uses registry.userService.addUser after checking that the user doesn't already exist.
 */
export const create: RequestHandler = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
    }

    try {
        // Check if user already exists via the service method
        if (registry.userService.userExists(username)) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        // Add the new user
        registry.userService.addUser(username, password);
        res.status(201).json({ message: "User created" });
    } catch (err: any) {
        res.status(500).json({ error: "Error creating user", details: err.message });
    }
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

    try {
        const user = registry.userService.authenticateUser(username, password);
        if (user) {
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err: any) {
        res.status(500).json({ error: "Error logging in", details: err.message });
    }
};

/**
 * Update user details.
 * (Not implemented in the UserService; returns a 501 Not Implemented.)
 */
export const update: RequestHandler = (req, res) => {
    res.status(501).json({ error: "Update user not implemented" });
};

/**
 * Delete a user.
 * Calls registry.userService.deleteUser using the user id from the URL parameters.
 */
export const remove: RequestHandler = (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: "User id is required" });
        return;
    }

    try {
        registry.userService.deleteUser(id);
        res.status(200).json({ message: "User deleted" });
    } catch (err: any) {
        res.status(500).json({ error: "Error deleting user", details: err.message });
    }
};
