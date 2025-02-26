import { RequestHandler } from "express";
import Registry from "../registry/Registry";
import getUserFromToken from "../utils/getUserFromToken";


/**
 * Create a new income transaction.
 * Expected request body:
 * - title (string)
 * - amount (number)
 * - date (string, convertible to Date)
 * - notes (string)
 */
export const create: RequestHandler = async (req, res): Promise<void> => {
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

    const registry = await Registry.getInstance();
    const incomeService = registry.incomeService;

    if (await incomeService.addIncome(userID, title, amount, new Date(date), notes)) {
        res.status(201).json({ message: "Income created" });
    }
    else {
        res.status(404).json({ message: "Failed to add income." });
    }
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
export const update: RequestHandler = async (req, res): Promise<void> => {
    const { id } = req.params;
    const { title, amount, date, notes } = req.body;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to update your income transaction." });
        return;
    }

    if (!id || !title || amount === undefined || !date) {
        res.status(400).json({ error: "Missing required fields: id, title, amount, date" });
        return;
    }

    const registry = await Registry.getInstance();
    const incomeService = registry.incomeService;

    if (await incomeService.updateIncome(id, userID, title, amount, new Date(date), notes)) {
        res.status(200).json({ message: "Income updated" });
    }
    else {
        res.status(404).json({ message: "Failed to update income." });
    }
};

/**
 * Delete an income transaction.
 * Expected request parameters:
 * - id: Income identifier
 */
export const remove: RequestHandler = async (req, res): Promise<void> => {
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

    const registry = await Registry.getInstance();
    const incomeService = registry.incomeService;

    if (await incomeService.deleteIncome(id, userID)) {
        res.status(200).json({ message: "Income deleted" });
    }
    else {
        res.status(200).json({ message: "Failed to delete income." });
    }
};

/**
 * List all income transactions for a given user.
 * Expected request parameters:
 * - userId (string): User identifier (taken from request params)
 */
export const listByUser: RequestHandler = async (req, res): Promise<void> => {
    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view income transactions." });
        return;
    }

    const registry = await Registry.getInstance();
    const incomeService = registry.incomeService;

    const incomes = await incomeService.getAllIncomesByUser(userID);
    res.status(200).json({ incomes });
};

/**
 * Find an income transaction by ID.
 * Expected request parameters:
 * - id: Income identifier
 */
export const findByID: RequestHandler = async (req, res): Promise<void> => {
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

    const registry = await Registry.getInstance();
    const incomeService = registry.incomeService;

    const income = await incomeService.findByID(id, userID);
    if (!income) {
        res.status(404).json({ message: "Income transaction not found." });
        return;
    }

    res.status(200).json(income.toJSON());
};
