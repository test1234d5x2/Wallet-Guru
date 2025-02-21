import { RequestHandler } from "express";
import Registry from "../registry/Registry";
import getUserFromToken from "../utils/getUserFromToken";

const registry = Registry.getInstance();
const incomeService = registry.incomeService;

/**
 * Create a new income.
 * Expected request body should include:
 * - title (string)
 * - amount (number)
 * - date (string, convertible to Date)
 * - notes (string)
 */
export const create: RequestHandler = (req, res) => {
    const { title, amount, date, notes } = req.body;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({ error: "You must be logged in to create an income transaction." })
        return;
    }

    if (!title || amount === undefined || !date || !notes) {
        res.status(400).json({ error: "Missing required fields: user, title, amount, date, notes" });
        return;
    }

    incomeService.addIncome(user, title, amount, new Date(date), notes);
    res.status(201).json({ message: "Income created" });
};

/**
 * Update an existing income.
 * Expected request parameters:
 * - id: Income identifier
 * Expected request body should include:
 * - title (string)
 * - amount (number)
 * - date (string, convertible to Date)
 * - notes (string)
 */
export const update: RequestHandler = (req, res) => {
    const { id } = req.params;
    const { title, amount, date, notes } = req.body;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({ error: "You must be logged in to update your income transaction." })
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
 * Delete an income.
 * Expected request parameters:
 * - id: Income identifier
 */
export const remove: RequestHandler = (req, res) => {
    const { id } = req.params;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({ error: "You must be logged in to remove your income transaction." })
        return;
    }

    if (!id) {
        res.status(400).json({ error: "Income id is required" });
        return;
    }

    incomeService.deleteIncome(id);
    res.status(200).json({ message: "Income deleted" });
};
