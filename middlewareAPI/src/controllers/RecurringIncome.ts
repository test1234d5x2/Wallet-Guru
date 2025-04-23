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

    const added = await recurringIncomeService.addRecurringIncome(email, userID, title, amount, new Date(date), notes, categoryID, rule)
    if (!added) {
        res.status(404).json({ message: "Failed to create recurring income." })
        return
    }

    res.status(201).json({ message: 'Recurring Income created successfully' })
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
    const recurringIncomeService = registry.recurringIncomeService

    const updated = await recurringIncomeService.updateRecurringIncome(email, id, userID, title, amount, new Date(date), notes, categoryID, rule)
    if (!updated) {
        res.status(404).json({ message: 'Failed to update recurring income.' })
        return
    }

    res.status(200).json({ message: 'Recurring Income updated successfully' })
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
    const recurringIncomeService = registry.recurringIncomeService

    const deleted = await recurringIncomeService.deleteRecurringIncome(email, id, userID)
    if (!deleted) {
        res.status(404).json({ message: 'Failed to delete recurring income.' })
        return
    }

    res.status(200).json({ message: 'Recurring Income deleted successfully' })
}

export const listByUser = async (req: Request, res: Response) => {
    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    const registry = await Registry.getInstance()
    const recurringIncomeService = registry.recurringIncomeService

    await recurringIncomeService.processDueRecurringIncomes()
    const recurringIncomes = await recurringIncomeService.getAllRecurringIncomesByUser(email, userID)
    res.status(200).json({ recurringIncomes })
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
    const recurringIncomeService = registry.recurringIncomeService

    const income = await recurringIncomeService.findByID(email, id, userID)
    if (!income) {
        res.status(404).json({ error: 'Recurring Income not found' })
        return
    }

    await recurringIncomeService.processDueRecurringIncomes()
    res.status(200).json(income.toJSON())
}
