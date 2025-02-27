import { RequestHandler } from "express";
import Registry from "../registry/Registry";
import getUserFromToken from "../utils/getUserFromToken";


/**
 * Create a new user.
 * Uses registry.userService.addUser after checking that the user doesn't already exist.
 */
export const create: RequestHandler = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required", message: "Username and password are required" });
        return;
    }

    const registry = await Registry.getInstance();
    const userService = registry.userService;

    if (await userService.userExists(username)) {
        res.status(409).json({ error: "User already exists", message: "User already exists." });
        return;
    }

    if (await userService.addUser(username, password)) {
        res.status(201).json({ message: "User created" });
    }
    else {
        res.status(409).json({ message: "User already exists" });
    }
};

/**
 * Authenticate a user.
 * Calls registry.userService.authenticateUser to verify credentials.
 */
export const login: RequestHandler = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
    }

    const registry = await Registry.getInstance();
    const userService = registry.userService;

    const token = await userService.authenticateUser(username, password);
    if (token) {
        res.status(200).json({ message: "Login successful", token: token });
    }
    else {
        res.status(404).json({ message: "Authentication failed" });
    }
    return
};


/**
 * Delete a user.
 * Calls registry.userService.deleteUser using the email to get the userID and then using the userID to delete the user.
 */
export const remove: RequestHandler = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "Email is required." });
        return;
    }

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to perform this action." });
        return;
    }

    const registry = await Registry.getInstance();
    const userService = registry.userService;
    const user = await userService.findByID(userID);

    if (!user) {
        res.status(401).json({ error: "You must be logged in to perform this action." })
        return;
    }

    if (user.getEmail() !== email) {
        res.status(401).json({ error: "You must be logged in to perform this action." })
        return;
    }

    if (await userService.deleteUser(email)) {
        res.status(200).json({ error: "User deleted" });
    }
    else {
        res.status(404).json({ error: "Failed to delete user." });
    }
};




/**
 * Change a user's password.
 * Expects `email` and `newPassword` in the request body.
 * Verifies the caller's identity using the token and calls userService.changePassword.
 */
export const changePassword: RequestHandler = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        res.status(400).json({ error: "Email and new password are required" });
        return;
    }

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to perform this action." });
        return;
    }

    const registry = await Registry.getInstance();
    const userService = registry.userService;
    const user = await userService.findByID(userID);

    if (!user) {
        res.status(401).json({ error: "User not found." });
        return;
    }

    if (user.getEmail() !== email) {
        res.status(401).json({ error: "You are not authorized to change this user's password." });
        return;
    }

    if (await userService.changePassword(email, newPassword)) {
        res.status(200).json({ message: "Password changed successfully" });
    } else {
        res.status(404).json({ error: "Failed to change password" });
    }
};
