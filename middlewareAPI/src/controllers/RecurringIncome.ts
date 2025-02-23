// src/controllers/RecurringIncomeController.ts
import { Request, Response } from 'express';
import Registry from '../registry/Registry';
import BasicRecurrenceRule from '../models/recurrenceModels/BasicRecurrenceRule';
import getUserFromToken from '../utils/getUserFromToken';

const registry = Registry.getInstance();

export const create = (req: Request, res: Response): void => {
    const { title, amount, date, notes, recurrenceRule } = req.body;

    // Instantiate a recurrence rule from the provided data.
    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval,
        new Date(recurrenceRule.startDate),
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    );

    registry.recurringIncomeService.addRecurringIncome(
        userID,
        title,
        amount,
        new Date(date),
        notes,
        rule
    );

    res.status(201).json({ message: 'Recurring Income created successfully' });
};

export const update = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { title, amount, date, notes } = req.body;

    registry.recurringIncomeService.updateRecurringIncome(
        id,
        title,
        amount,
        new Date(date),
        notes
    );

    res.status(200).json({ message: 'Recurring Income updated successfully' });
};

export const remove = (req: Request, res: Response): void => {
    const { id } = req.params;
    registry.recurringIncomeService.deleteRecurringIncome(id);
    res.status(200).json({ message: 'Recurring Income deleted successfully' });
};


export const listByUser = (req: Request, res: Response): void => {
    const { userID } = req.params;
    const incomes = registry.recurringIncomeService.getAllRecurringIncomesByUser(userID);
    res.status(200).json(incomes.map(inc => inc.toJSON()));
};

export const findByID = (req: Request, res: Response): void => {

    const { id } = req.params;
    const income = registry.recurringIncomeService.findByID(id);
    if (!income) {
        res.status(404).json({ error: 'Recurring Income not found' });
        return;
    }
    res.status(200).json(income.toJSON());
};
