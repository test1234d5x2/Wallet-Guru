import { RequestHandler } from "express";
import Registry from "../registry/Registry";

const registry = Registry.getInstance();

/**
 * Create a new income.
 * Expected request body should include:
 * - user (object)
 * - title (string)
 * - amount (number)
 * - date (string, convertible to Date)
 * - notes (string)
 */
export const create: RequestHandler = (req, res) => {
    const { user, title, amount, date, notes } = req.body;

    if (!user || !title || amount === undefined || !date || !notes) {
        res.status(400).json({ error: "Missing required fields: user, title, amount, date, notes" });
        return;
    }

    try {
        registry.incomeService.addIncome(user, title, amount, new Date(date), notes);
        res.status(201).json({ message: "Income created" });
    } catch (err: any) {
        res.status(500).json({ error: "Error creating income", details: err.message });
    }
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

    if (!id || !title || amount === undefined || !date || !notes) {
        res.status(400).json({ error: "Missing required fields: id, title, amount, date, notes" });
        return;
    }

    try {
        registry.incomeService.updateIncome(id, title, amount, new Date(date), notes);
        res.status(200).json({ message: "Income updated" });
    } catch (err: any) {
        res.status(500).json({ error: "Error updating income", details: err.message });
    }
};

/**
 * Delete an income.
 * Expected request parameters:
 * - id: Income identifier
 */
export const remove: RequestHandler = (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: "Income id is required" });
        return;
    }

    try {
        registry.incomeService.deleteIncome(id);
        res.status(200).json({ message: "Income deleted" });
    } catch (err: any) {
        res.status(500).json({ error: "Error deleting income", details: err.message });
    }
};
