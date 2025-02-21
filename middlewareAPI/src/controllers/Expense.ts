import { RequestHandler } from "express";
import Registry from "../registry/Registry";
import getUserFromToken from "../utils/getUserFromToken";

const registry = Registry.getInstance();
const expenseCategoryService = registry.expenseCategoryService;
const expenseService = registry.expenseService;


/**
 * Create a new expense.
 * Expected request body:
 * - title (string)
 * - amount (number)
 * - date (string, convertible to Date)
 * - notes (string)
 * - expenseCategoryID (string)
 * - receipt (optional string)
 */
export const create: RequestHandler = (req, res) => {
    const { title, amount, date, notes, expenseCategoryID, receipt } = req.body;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({ error: "You must be logged in to create an expense." });
        return;
    }

    const expenseCategory = expenseCategoryService.findByID(expenseCategoryID);
    if (!expenseCategory) {
        res.status(404).json({ error: "The expense category could not be found." });
        return;
    }

    if (!title || amount === undefined || !date || !notes || !expenseCategoryID) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    try {
        expenseService.addExpense(
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
 * Expected request body:
 * - title (string)
 * - amount (number)
 * - date (string, convertible to Date)
 * - notes (string)
 * - expenseCategoryID (string)
 * - receipt (optional string)
 */
export const update: RequestHandler = (req, res) => {
    const { id } = req.params;
    const { title, amount, date, notes, expenseCategoryID, receipt } = req.body;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({ error: "You must be logged in to update an expense." });
        return;
    }

    const expenseCategory = expenseCategoryService.findByID(expenseCategoryID);
    if (!expenseCategory) {
        res.status(404).json({ error: "The expense category could not be found." });
        return;
    }

    if (!id || !title || amount === undefined || !date || !notes || !expenseCategoryID) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    try {
        expenseService.updateExpense(
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

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({ error: "You must be logged in to delete an expense." });
        return;
    }

    if (!id) {
        res.status(400).json({ error: "Expense id is required" });
        return;
    }

    try {
        expenseService.deleteExpense(id);
        res.status(200).json({ message: "Expense deleted" });
    } catch (err: any) {
        res.status(500).json({ error: "Error deleting expense", details: err.message });
    }
};
