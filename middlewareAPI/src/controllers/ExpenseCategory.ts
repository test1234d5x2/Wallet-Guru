import { RequestHandler } from "express";
import Registry from "../registry/Registry";
import getUserFromToken from "../utils/getUserFromToken";
import BasicRecurrenceRule from "../models/recurrenceModels/BasicRecurrenceRule";


/**
 * Create a new expense category.
 * Expected request body should include:
 * - name (string)
 * - monthlyBudget (number)
 * - recurrenceRule (RecurrenceRule)
 */
export const create: RequestHandler = async (req, res): Promise<void> => {
    const { name, monthlyBudget, recurrenceRule, colour } = req.body;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to create an expense category." });
        return;
    }

    if (!name || monthlyBudget === undefined || !recurrenceRule || !colour) {
        res.status(400).json({ error: "Missing required fields: name, monthlyBudget, recurrenceRule, colour" });
        return;
    }

    const registry = await Registry.getInstance();
    const expenseCategoryService = registry.expenseCategoryService;

    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval,
        new Date(recurrenceRule.startDate),
        recurrenceRule.nextTriggerDate ? new Date(recurrenceRule.nextTriggerDate) : undefined,
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    );

    if (await expenseCategoryService.addExpenseCategory(userID, name, monthlyBudget, rule, colour)) {
        res.status(201).json({ message: "Expense category created" });
    }
    else {
        res.status(404).json({ message: "Failed to add the expense category." })
    }
};

/**
 * Update an existing expense category.
 * Expected request parameters:
 * - id: ExpenseCategory identifier
 * Expected request body should include:
 * - name (string)
 * - monthlyBudget (number)
 * - recurrenceRule (RecurrenceRule)
 */
export const update: RequestHandler = async (req, res): Promise<void> => {
    const { id } = req.params;
    const { name, monthlyBudget, recurrenceRule, colour } = req.body;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to update an expense category." });
        return;
    }

    if (!id || !name || monthlyBudget === undefined || !recurrenceRule || !colour) {
        res.status(400).json({ error: "Missing required fields: id, name, monthlyBudget, recurrenceRule, colour" });
        return;
    }

    const registry = await Registry.getInstance();
    const expenseCategoryService = registry.expenseCategoryService;

    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval,
        new Date(recurrenceRule.startDate),
        recurrenceRule.nextTriggerDate ? new Date(recurrenceRule.nextTriggerDate) : undefined,
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    );

    if (await expenseCategoryService.updateExpenseCategory(id, userID, name, monthlyBudget, rule, colour)) {
        res.status(200).json({ message: "Expense category updated" });
    }
    else {
        res.status(404).json({ message: "Failed to update the expense category." });
    }
};

/**
 * Delete an expense category.
 * Expected request parameters:
 * - id: ExpenseCategory identifier
 */
export const remove: RequestHandler = async (req, res): Promise<void> => {
    const { id } = req.params;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to delete an expense category." });
        return;
    }

    if (!id) {
        res.status(400).json({ error: "Expense category id is required" });
        return;
    }

    const registry = await Registry.getInstance();
    const expenseCategoryService = registry.expenseCategoryService;

    if (await expenseCategoryService.deleteExpenseCategory(id, userID)) {
        res.status(200).json({ message: "Expense category deleted" });
    }
    else {
        res.status(404).json({ message: "Failed to remove expense category." });
    }

};

/**
 * List all expense categories for a given user.
 * Retrieves all categories associated with the authenticated user.
 */
export const listByUser: RequestHandler = async (req, res): Promise<void> => {
    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view expense categories." });
        return;
    }

    const registry = await Registry.getInstance();
    const expenseCategoryService = registry.expenseCategoryService;

    const categories = await expenseCategoryService.getAllCategoriesByUser(userID);
    res.status(200).json({ categories });
};

/**
 * Find an expense category by ID.
 * Expected request parameters:
 * - id: ExpenseCategory identifier
 */
export const findByID: RequestHandler = async (req, res): Promise<void> => {
    const { id } = req.params;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view an expense category." });
        return;
    }

    if (!id) {
        res.status(400).json({ error: "Expense category id is required" });
        return;
    }

    const registry = await Registry.getInstance();
    const expenseCategoryService = registry.expenseCategoryService;

    const category = await expenseCategoryService.findByID(id, userID);
    if (!category) {
        res.status(404).json({ error: "Expense category not found" });
        return;
    }

    res.status(200).json(category.toJSON());
};
