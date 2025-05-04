import { Request, Response } from 'express'
import Registry from '../registry/Registry'
import BasicRecurrenceRule from '../models/recurrenceModels/BasicRecurrenceRule'
import getUserFromToken from '../utils/getUserFromToken'

export const create = async (req: Request, res: Response) => {
    const { title, amount, date, notes, categoryID, recurrenceRule } = req.body

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    if (!title || amount === undefined || !date || !recurrenceRule || !categoryID) {
        res.status(400).json({ message: "Missing required fields: title, amount, date, categoryID, recurrenceRule" })
        return
    }

    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval,
        new Date(recurrenceRule.startDate),
        recurrenceRule.nextTriggerDate ? new Date(recurrenceRule.nextTriggerDate) : undefined,
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    )

    const registry = await Registry.getInstance()
    const recurringExpenseService = registry.recurringExpenseService

    const added = await recurringExpenseService.addRecurringExpense(email, userID, title, amount, new Date(date), notes, categoryID, rule)
    if (!added) {
        res.status(404).json({ message: 'Failed to create recurring expense.' })
        return
    }

    res.status(201).json({ message: 'Recurring Expense created successfully' })
}

export const update = async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, amount, date, notes, categoryID, recurrenceRule } = req.body

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    if (!title || amount === undefined || !date || !recurrenceRule || !categoryID) {
        res.status(400).json({ message: "Missing required fields: title, amount, date, recurrenceRule" })
        return
    }

    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval,
        new Date(recurrenceRule.startDate),
        recurrenceRule.nextTriggerDate ? new Date(recurrenceRule.nextTriggerDate) : undefined,
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    )

    const registry = await Registry.getInstance()
    const recurringExpenseService = registry.recurringExpenseService

    const updated = await recurringExpenseService.updateRecurringExpense(email, id, userID, title, amount, new Date(date), notes, categoryID, rule)
    if (!updated) {
        res.status(404).json({ message: 'Failed to update recurring expense.' })
        return
    }

    res.status(200).json({ message: 'Recurring Expense updated successfully' })
}

export const remove = async (req: Request, res: Response) => {
    const { id } = req.params

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    const registry = await Registry.getInstance()
    const recurringExpenseService = registry.recurringExpenseService

    const deleted = await recurringExpenseService.deleteRecurringExpense(email, id, userID)
    if (!deleted) {
        res.status(404).json({ message: 'Failed to delete recurring expense.' })
        return
    }

    res.status(200).json({ message: 'Recurring Expense deleted successfully' })
}

export const listByUser = async (req: Request, res: Response) => {
    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    const registry = await Registry.getInstance()
    const recurringExpenseService = registry.recurringExpenseService

    // Check through all recurring expenses that need to be updated.
    await recurringExpenseService.processDueRecurringExpenses()
    const recurringExpenses = await recurringExpenseService.getAllRecurringExpensesByUser(email, userID)
    res.status(200).json({ recurringExpenses })
}

export const findByID = async (req: Request, res: Response) => {
    const { id } = req.params

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    const registry = await Registry.getInstance()
    const recurringExpenseService = registry.recurringExpenseService

    const expense = await recurringExpenseService.findByID(email, id, userID)
    if (!expense) {
        res.status(404).json({ error: 'Recurring Expense not found' })
        return
    }
    
    // Check through all recurring expenses that need to be updated.
    await recurringExpenseService.processDueRecurringExpenses()
    res.status(200).json(expense.toJSON())
}
