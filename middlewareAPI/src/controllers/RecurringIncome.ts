import { Request, Response } from 'express'
import Registry from '../registry/Registry'
import BasicRecurrenceRule from '../models/recurrenceModels/BasicRecurrenceRule'
import getUserFromToken from '../utils/getUserFromToken'

export const create = async (req: Request, res: Response) => {
    const { title, amount, date, notes, recurrenceRule } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to create a recurring income transaction." })
        return
    }

    if (!title || amount === undefined || !date || !recurrenceRule) {
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
    const recurringIncomeService = registry.recurringIncomeService

    const added = await recurringIncomeService.addRecurringIncome(userID, title, amount, new Date(date), notes, rule)
    if (!added) {
        res.status(404).json({ message: "Failed to create recurring income." })
        return
    }

    res.status(201).json({ message: 'Recurring Income created successfully' })
}

export const update = async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, amount, date, notes, recurrenceRule } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to update a recurring income transaction." })
        return
    }

    if (!title || amount === undefined || !date || !recurrenceRule) {
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
    const recurringIncomeService = registry.recurringIncomeService

    const updated = await recurringIncomeService.updateRecurringIncome(id, userID, title, amount, new Date(date), notes, rule)
    if (!updated) {
        res.status(404).json({ message: 'Failed to update recurring income.' })
        return
    }

    res.status(200).json({ message: 'Recurring Income updated successfully' })
}

export const remove = async (req: Request, res: Response) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to delete a recurring income transaction." })
        return
    }

    const registry = await Registry.getInstance()
    const recurringIncomeService = registry.recurringIncomeService

    const deleted = await recurringIncomeService.deleteRecurringIncome(id, userID)
    if (!deleted) {
        res.status(404).json({ message: 'Failed to delete recurring income.' })
        return
    }

    res.status(200).json({ message: 'Recurring Income deleted successfully' })
}

export const listByUser = async (req: Request, res: Response) => {
    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to view your recurring income transactions." })
        return
    }

    const registry = await Registry.getInstance()
    const recurringIncomeService = registry.recurringIncomeService

    await recurringIncomeService.processDueRecurringIncomes()
    const recurringIncomes = await recurringIncomeService.getAllRecurringIncomesByUser(userID)
    res.status(200).json({ recurringIncomes })
}

export const findByID = async (req: Request, res: Response) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to view your recurring income transaction." })
        return
    }

    const registry = await Registry.getInstance()
    const recurringIncomeService = registry.recurringIncomeService

    const income = await recurringIncomeService.findByID(id, userID)
    if (!income) {
        res.status(404).json({ error: 'Recurring Income not found' })
        return
    }

    await recurringIncomeService.processDueRecurringIncomes()
    res.status(200).json(income.toJSON())
}
