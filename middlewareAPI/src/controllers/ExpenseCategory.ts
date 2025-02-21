import { RequestHandler } from "express";
import Registry from "../registry/Registry";
import getUserFromToken from "../utils/getUserFromToken";

const registry = Registry.getInstance();
const expenseCategoryService = registry.expenseCategoryService;

/**
 * Create a new expense category.
 * Expected request body should include:
 * - name (string)
 * - monthlyBudget (number)
 */
export const create: RequestHandler = (req, res) => {
    const { name, monthlyBudget } = req.body;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({ error: "You must be logged in to create an expense category." })
        return;
    }

    if (!name || monthlyBudget === undefined) {
        res.status(400).json({ error: "Missing required fields: user, name, monthlyBudget" });
        return;
    }

    expenseCategoryService.addExpenseCategory(user, name, monthlyBudget);
    res.status(201).json({ message: "Expense category created" });
};

/**
 * Update an existing expense category.
 * Expected request parameters:
 * - id: ExpenseCategory identifier
 * Expected request body should include:
 * - name (string)
 * - monthlyBudget (number)
 */
export const update: RequestHandler = (req, res) => {
    const { id } = req.params;
    const { name, monthlyBudget } = req.body;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({ error: "You must be logged in to update an expense category." })
        return;
    }

    if (!id || !name || monthlyBudget === undefined) {
        res.status(400).json({ error: "Missing required fields: id, name, monthlyBudget" });
        return;
    }

    expenseCategoryService.updateExpenseCategory(id, name, monthlyBudget);
    res.status(200).json({ message: "Expense category updated" });
};

/**
 * Delete an expense category.
 * Expected request parameters:
 * - id: ExpenseCategory identifier
 */
export const remove: RequestHandler = (req, res) => {
    const { id } = req.params;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({ error: "You must be logged in to delete an expense category." })
        return;
    }

    if (!id) {
        res.status(400).json({ error: "Expense category id is required" });
        return;
    }

    expenseCategoryService.deleteExpenseCategory(id);
    res.status(200).json({ message: "Expense category deleted" });
};
