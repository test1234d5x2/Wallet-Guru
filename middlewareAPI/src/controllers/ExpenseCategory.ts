import { RequestHandler } from "express"
import Registry from "../registry/Registry"
import getUserFromToken from "../utils/getUserFromToken"
import BasicRecurrenceRule from "../models/recurrenceModels/BasicRecurrenceRule"

export const create: RequestHandler = async (req, res) => {
    const { name, monthlyBudget, recurrenceRule, colour } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to create an expense category." })
        return
    }

    if (!name || monthlyBudget === undefined || !recurrenceRule || !colour) {
        res.status(400).json({ error: "Missing required fields: name, monthlyBudget, recurrenceRule, colour" })
        return
    }

    const registry = await Registry.getInstance()
    const expenseCategoryService = registry.expenseCategoryService

    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval,
        new Date(recurrenceRule.startDate),
        recurrenceRule.nextTriggerDate ? new Date(recurrenceRule.nextTriggerDate) : undefined,
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    )

    const added = await expenseCategoryService.addExpenseCategory(userID, name, monthlyBudget, rule, colour)
    if (added) {
        res.status(201).json({ message: "Expense category created" })
    } else {
        res.status(404).json({ message: "Failed to add the expense category." })
    }
}

export const update: RequestHandler = async (req, res) => {
    const { id } = req.params
    const { name, monthlyBudget, recurrenceRule, colour } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to update an expense category." })
        return
    }

    if (!id || !name || monthlyBudget === undefined || !recurrenceRule || !colour) {
        res.status(400).json({ error: "Missing required fields: id, name, monthlyBudget, recurrenceRule, colour" })
        return
    }

    const registry = await Registry.getInstance()
    const expenseCategoryService = registry.expenseCategoryService

    const rule = new BasicRecurrenceRule(
        recurrenceRule.frequency,
        recurrenceRule.interval,
        new Date(recurrenceRule.startDate),
        recurrenceRule.nextTriggerDate ? new Date(recurrenceRule.nextTriggerDate) : undefined,
        recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : undefined
    )

    const updated = await expenseCategoryService.updateExpenseCategory(id, userID, name, monthlyBudget, rule, colour)
    if (updated) {
        res.status(200).json({ message: "Expense category updated" })
    } else {
        res.status(404).json({ message: "Failed to update the expense category." })
    }
}

export const remove: RequestHandler = async (req, res) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to delete an expense category." })
        return
    }

    if (!id) {
        res.status(400).json({ error: "Expense category id is required" })
        return
    }

    const registry = await Registry.getInstance()
    const expenseCategoryService = registry.expenseCategoryService

    const deleted = await expenseCategoryService.deleteExpenseCategory(id, userID)
    if (deleted) {
        res.status(200).json({ message: "Expense category deleted" })
    } else {
        res.status(404).json({ message: "Failed to remove expense category." })
    }
}

export const listByUser: RequestHandler = async (req, res) => {
    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view expense categories." })
        return
    }

    const registry = await Registry.getInstance()
    const expenseCategoryService = registry.expenseCategoryService

    const categories = await expenseCategoryService.getAllCategoriesByUser(userID)
    res.status(200).json({ categories })
}

export const findByID: RequestHandler = async (req, res) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view an expense category." })
        return
    }

    if (!id) {
        res.status(400).json({ error: "Expense category id is required" })
        return
    }

    const registry = await Registry.getInstance()
    const expenseCategoryService = registry.expenseCategoryService

    const category = await expenseCategoryService.findByID(id, userID)
    if (!category) {
        res.status(404).json({ error: "Expense category not found" })
        return
    }

    res.status(200).json(category.toJSON())
}
