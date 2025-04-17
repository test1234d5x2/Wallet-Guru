import { Request, Response } from 'express'
import Registry from '../registry/Registry'
import BasicRecurrenceRule from '../models/recurrenceModels/BasicRecurrenceRule'
import getUserFromToken from '../utils/getUserFromToken'

const registry = Registry.getInstance()

export const create = (req: Request, res: Response): void => {
    const { title, amount, date, notes, categoryID, recurrenceRule } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to create a recurring income transaction." })
        return
    }

    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval,
        new Date(recurrenceRule.startDate),
        undefined,
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    )

    registry.recurringIncomeService.addRecurringIncome(userID, title, amount, new Date(date), notes, categoryID, rule)

    registry.recurringIncomeService.processDueRecurringIncomes()
    res.status(201).json({ message: 'Recurring Income created successfully' })
}

export const update = (req: Request, res: Response): void => {
    const { id } = req.params
    const { title, amount, date, notes, categoryID } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to update a recurring income transaction." })
        return
    }

    registry.recurringIncomeService.updateRecurringIncome(id, title, amount, new Date(date), notes, categoryID)

    registry.recurringIncomeService.processDueRecurringIncomes()
    res.status(200).json({ message: 'Recurring Income updated successfully' })
}

export const remove = (req: Request, res: Response): void => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to delete a recurring income transaction." })
        return
    }

    registry.recurringIncomeService.deleteRecurringIncome(id)
    registry.recurringIncomeService.processDueRecurringIncomes()
    res.status(200).json({ message: 'Recurring Income deleted successfully' })
}

export const listByUser = (req: Request, res: Response): void => {
    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to view your recurring income transactions." })
        return
    }

    const recurringIncomes = registry.recurringIncomeService.getAllRecurringIncomesByUser(userID)
    registry.recurringIncomeService.processDueRecurringIncomes()
    res.status(200).json({ recurringIncomes })
}

export const findByID = (req: Request, res: Response): void => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to view your recurring income transaction." })
        return
    }

    const income = registry.recurringIncomeService.findByID(id)
    if (!income) {
        res.status(404).json({ error: 'Recurring Income not found' })
        return
    }

    registry.recurringIncomeService.processDueRecurringIncomes()
    res.status(200).json(income.toJSON())
}
