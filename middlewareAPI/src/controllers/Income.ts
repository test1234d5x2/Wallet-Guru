import { RequestHandler } from "express";
import Registry from "../registry/Registry";
import getUserFromToken from "../utils/getUserFromToken";

const registry = Registry.getInstance();
const incomeService = registry.incomeService;

/**
 * Create a new income transaction.
 * Expected request body:
 * - title (string)
 * - amount (number)
 * - date (string, convertible to Date)
 * - notes (string)
 */
export const create: RequestHandler = (req, res) => {
    const { title, amount, date, notes } = req.body;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to create an income transaction." });
        return;
    }

    if (!title || amount === undefined || !date) {
        res.status(400).json({ message: "Missing required fields: title, amount, date" });
        return;
    }

    incomeService.addIncome(userID, title, amount, new Date(date), notes);
    res.status(201).json({ message: "Income created" });
};

/**
 * Update an existing income transaction.
 * Expected request parameters:
 * - id: Income identifier
 * Expected request body:
 * - title (string)
 * - amount (number)
 * - date (string, convertible to Date)
 * - notes (string)
 */
export const update: RequestHandler = (req, res) => {
    const { id } = req.params;
    const { title, amount, date, notes } = req.body;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to update your income transaction." });
        return;
    }

    if (!id || !title || amount === undefined || !date || !notes) {
        res.status(400).json({ error: "Missing required fields: id, title, amount, date, notes" });
        return;
    }

    incomeService.updateIncome(id, title, amount, new Date(date), notes);
    res.status(200).json({ message: "Income updated" });
};

/**
 * Delete an income transaction.
 * Expected request parameters:
 * - id: Income identifier
 */
export const remove: RequestHandler = (req, res) => {
    const { id } = req.params;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to remove your income transaction." });
        return;
    }

    if (!id) {
        res.status(400).json({ error: "Income id is required" });
        return;
    }

    incomeService.deleteIncome(id);
    res.status(200).json({ message: "Income deleted" });
};

/**
 * List all income transactions for a given user.
 * Expected request parameters:
 * - userId (string): User identifier (taken from request params)
 */
export const listByUser: RequestHandler = (req, res) => {
    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view income transactions." });
        return;
    }

    const incomes = incomeService.getAllIncomesByUser(userID);
    res.status(200).json({ incomes });
};

/**
 * Find an income transaction by ID.
 * Expected request parameters:
 * - id: Income identifier
 */
export const findByID: RequestHandler = (req, res) => {
    const { id } = req.params;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to view an income transaction." });
        return;
    }

    if (!id) {
        res.status(400).json({ message: "Income ID is required." });
        return;
    }

    const income = incomeService.findByID(id);
    if (!income) {
        res.status(404).json({ message: "Income transaction not found." });
        return;
    }

    res.status(200).json({ income });
};
