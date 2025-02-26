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

    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval,
        new Date(recurrenceRule.startDate),
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    );

    const registry = await Registry.getInstance();
    const recurringExpenseService = registry.recurringExpenseService;

    recurringExpenseService.addRecurringExpense(
        userID,
        title,
        amount,
        new Date(date),
        notes,
        categoryID,
        rule
    );

    recurringExpenseService.processDueRecurringExpenses();
    res.status(201).json({ message: 'Recurring Expense created successfully' });
};

export const update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, amount, date, notes, categoryID } = req.body;

    const userID = getUserFromToken(req);
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to update a recurring expense transaction." });
        return;
    }

    const registry = await Registry.getInstance();
    const recurringExpenseService = registry.recurringExpenseService;

    recurringExpenseService.updateRecurringExpense(
        id,
        title,
        amount,
        new Date(date),
        notes,
        categoryID
    );

    recurringExpenseService.processDueRecurringExpenses();
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

    recurringExpenseService.deleteRecurringExpense(id);
    recurringExpenseService.processDueRecurringExpenses();
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
    const recurringExpenses = recurringExpenseService.getAllRecurringExpensesByUser(userID);
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
    const expense = recurringExpenseService.findByID(id);
    if (!expense) {
        res.status(404).json({ error: 'Recurring Expense not found' });
        return;
    }
    res.status(200).json(expense.toJSON());
};
