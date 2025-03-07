import { Request, Response } from 'express';
import Registry from '../registry/Registry';
import BasicRecurrenceRule from '../models/recurrenceModels/BasicRecurrenceRule';
import getUserFromToken from '../utils/getUserFromToken';


export const create = async (req: Request, res: Response): Promise<void> => {
    const { title, amount, date, notes, categoryID, recurrenceRule } = req.body;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to create a recurring expense transaction." });
        return;
    }

    if (!title || amount === undefined || !date || !recurrenceRule || !categoryID) {
        res.status(400).json({ message: "Missing required fields: title, amount, date, categoryID, recurrenceRule" });
        return;
    }

    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval,
        new Date(recurrenceRule.startDate),
        recurrenceRule.nextTriggerDate ? new Date(recurrenceRule.nextTriggerDate) : undefined,
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    );

    const registry = await Registry.getInstance();
    const recurringExpenseService = registry.recurringExpenseService;

    if (!await recurringExpenseService.addRecurringExpense(userID, title, amount, new Date(date), notes, categoryID, rule)) {
        res.status(201).json({ message: 'Failed to create recurring expense.' });
        return
    }

    res.status(201).json({ message: 'Recurring Expense created successfully' });
};

export const update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, amount, date, notes, categoryID, recurrenceRule } = req.body;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to update a recurring expense transaction." });
        return;
    }

    if (!title || amount === undefined || !date || !recurrenceRule || !categoryID) {
        res.status(400).json({ message: "Missing required fields: title, amount, date, recurrenceRule" });
        return;
    }

    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval, new Date(recurrenceRule.startDate),
        recurrenceRule.nextTriggerDate ? new Date(recurrenceRule.nextTriggerDate) : undefined,
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    );

    const registry = await Registry.getInstance();
    const recurringExpenseService = registry.recurringExpenseService;

    if (!await recurringExpenseService.updateRecurringExpense(id, userID, title, amount, new Date(date), notes, categoryID, rule)) {
        res.status(404).json({ message: 'Failed to update recurring expense.' });
        return
    }

    res.status(200).json({ message: 'Recurring Expense updated successfully' });
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to delete a recurring expense transaction." });
        return;
    }

    const registry = await Registry.getInstance();
    const recurringExpenseService = registry.recurringExpenseService;

    if (!await recurringExpenseService.deleteRecurringExpense(id, userID)) {
        res.status(404).json({ message: 'Failed to delete recurring expense.' });
    }

    res.status(200).json({ message: 'Recurring Expense deleted successfully' });
};

export const listByUser = async (req: Request, res: Response): Promise<void> => {
    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to view your recurring expense transactions." });
        return;
    }

    const registry = await Registry.getInstance();
    const recurringExpenseService = registry.recurringExpenseService;

    recurringExpenseService.processDueRecurringExpenses();
    const recurringExpenses = await recurringExpenseService.getAllRecurringExpensesByUser(userID);
    res.status(200).json({ recurringExpenses });
};

export const findByID = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to view a recurring expense transaction." });
        return;
    }

    const registry = await Registry.getInstance();
    const recurringExpenseService = registry.recurringExpenseService;

    recurringExpenseService.processDueRecurringExpenses();
    const expense = await recurringExpenseService.findByID(id, userID);
    if (!expense) {
        res.status(404).json({ error: 'Recurring Expense not found' });
        return;
    }
    res.status(200).json(expense.toJSON());
};
