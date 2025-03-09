import { RequestHandler } from "express";
import Registry from "../registry/Registry";
import getUserFromToken from "../utils/getUserFromToken";


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
export const create: RequestHandler = async (req, res): Promise<void> => {
    const { title, amount, date, notes, expenseCategoryID, receipt } = req.body;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to create an expense." });
        return;
    }

    if (!title || amount === undefined || !date || !expenseCategoryID) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    const registry = await Registry.getInstance();
    const expenseCategoryService = registry.expenseCategoryService;
    const expenseService = registry.expenseService;

    const expenseCategory = await expenseCategoryService.findByID(expenseCategoryID, userID);
    if (!expenseCategory) {
        res.status(404).json({ message: "The expense category could not be found." });
        return;
    }

    if (await expenseService.addExpense(userID, title, amount, new Date(date), notes, expenseCategoryID, receipt)) {
        res.status(201).json({ message: "Expense created" });
    }
    else {
        res.status(404).json({ message: "Failed to add expense." });
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
export const update: RequestHandler = async (req, res): Promise<void> => {
    const { id } = req.params;
    const { title, amount, date, notes, expenseCategoryID, receipt } = req.body;

    console.log(expenseCategoryID)

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to update an expense." });
        return;
    }

    if (!id || !title || amount === undefined || !date || !expenseCategoryID) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    const registry = await Registry.getInstance();
    const expenseCategoryService = registry.expenseCategoryService;
    const expenseService = registry.expenseService;

    const expenseCategory = await expenseCategoryService.findByID(expenseCategoryID, userID);
    if (!expenseCategory) {
        res.status(404).json({ error: "The expense category could not be found." });
        return;
    }

    if (await expenseService.updateExpense(id, userID, title, amount, new Date(date), notes, expenseCategoryID, receipt)) {
        res.status(200).json({ message: "Expense updated" });
    }
    else {
        res.status(404).json({ message: "Failed to update expense" });
    }
};

/**
 * Delete an expense.
 * Expected request parameters:
 * - id: Expense identifier
 */
export const remove: RequestHandler = async (req, res): Promise<void> => {
    const { id } = req.params;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to delete an expense." });
        return;
    }

    if (!id) {
        res.status(400).json({ error: "Expense id is required" });
        return;
    }

    const registry = await Registry.getInstance();
    const expenseService = registry.expenseService;

    if (await expenseService.deleteExpense(id, userID)) {
        res.status(200).json({ message: "Expense deleted" });
    }
    else {
        res.status(404).json({ message: "Failed to delete expense." });
    }
};

/**
 * List all expenses for a given user.
 * Expected request parameters:
 * - userId (string): User identifier (taken from the request params)
 */
export const listByUser: RequestHandler = async (req, res): Promise<void> => {
    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view expenses." });
        return;
    }

    const registry = await Registry.getInstance();
    const expenseService = registry.expenseService;

    const expenses = await expenseService.getAllExpensesByUser(userID);
    res.status(200).json({ expenses });
};

/**
 * Find an expense by ID.
 * Expected request parameters:
 * - id: Expense identifier
 */
export const findByID: RequestHandler = async (req, res): Promise<void> => {
    const { id } = req.params;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to view an expense." });
        return;
    }

    if (!id) {
        res.status(400).json({ message: "Expense ID is required." });
        return;
    }

    const registry = await Registry.getInstance();
    const expenseService = registry.expenseService;

    const expense = await expenseService.findByID(id, userID);
    if (!expense) {
        res.status(404).json({ message: "Expense not found." });
        return;
    }

    res.status(200).json(expense.toJSON());
};
