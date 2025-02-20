import { RequestHandler } from "express";
import Registry from "../registry/Registry";

const registry = Registry.getInstance();

/**
 * Create a new expense.
 * Expected request body should contain:
 * - user (object)
 * - title (string)
 * - amount (number)
 * - date (string, convertible to Date)
 * - notes (string)
 * - expenseCategory (object)
 * - receipt (optional string)
 */
export const create: RequestHandler = (req, res) => {
    const { user, title, amount, date, notes, expenseCategory, receipt } = req.body;

    if (!user || !title || amount === undefined || !date || !notes || !expenseCategory) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    try {
        registry.expenseService.addExpense(
            user,
            title,
            amount,
            new Date(date),
            notes,
            expenseCategory,
            receipt
        );
        res.status(201).json({ message: "Expense created" });
    } catch (err: any) {
        res.status(500).json({ error: "Error creating expense", details: err.message });
    }
};

/**
 * Update an existing expense.
 * Expected request parameters:
 * - id: Expense identifier
 * Expected request body should contain:
 * - title (string)
 * - amount (number)
 * - date (string, convertible to Date)
 * - notes (string)
 * - expenseCategory (object)
 * - receipt (optional string)
 */
export const update: RequestHandler = (req, res) => {
    const { id } = req.params;
    const { title, amount, date, notes, expenseCategory, receipt } = req.body;

    if (!id || !title || amount === undefined || !date || !notes || !expenseCategory) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    try {
        registry.expenseService.updateExpense(
            id,
            title,
            amount,
            new Date(date),
            notes,
            expenseCategory,
            receipt
        );
        res.status(200).json({ message: "Expense updated" });
    } catch (err: any) {
        res.status(500).json({ error: "Error updating expense", details: err.message });
    }
};

/**
 * Delete an expense.
 * Expected request parameters:
 * - id: Expense identifier
 */
export const remove: RequestHandler = (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: "Expense id is required" });
        return;
    }

    try {
        registry.expenseService.deleteExpense(id);
        res.status(200).json({ message: "Expense deleted" });
    } catch (err: any) {
        res.status(500).json({ error: "Error deleting expense", details: err.message });
    }
};
