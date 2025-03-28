import { RequestHandler } from "express"
import Registry from "../registry/Registry"
import getUserFromToken from "../utils/getUserFromToken"

const registry = Registry.getInstance()
const expenseCategoryService = registry.expenseCategoryService

export const create: RequestHandler = (req, res) => {
    const { name, monthlyBudget, recurrenceRule } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to create an expense category." })
        return
    }

    if (!name || monthlyBudget === undefined) {
        res.status(400).json({ error: "Missing required fields: name, monthlyBudget" })
        return
    }

    expenseCategoryService.addExpenseCategory(userID, name, monthlyBudget, recurrenceRule)
    res.status(201).json({ message: "Expense category created" })
}

export const update: RequestHandler = (req, res) => {
    const { id } = req.params
    const { name, monthlyBudget, recurrenceRule } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to update an expense category." })
        return
    }

    if (!id || !name || monthlyBudget === undefined) {
        res.status(400).json({ error: "Missing required fields: id, name, monthlyBudget" })
        return
    }

    expenseCategoryService.updateExpenseCategory(id, name, monthlyBudget, recurrenceRule)
    res.status(200).json({ message: "Expense category updated" })
}

export const remove: RequestHandler = (req, res) => {
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

    expenseCategoryService.deleteExpenseCategory(id)
    res.status(200).json({ message: "Expense category deleted" })
}

export const listByUser: RequestHandler = (req, res) => {
    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view expense categories." })
        return
    }

    const categories = expenseCategoryService.getAllCategoriesByUser(userID)
    res.status(200).json({ categories })
}

export const findByID: RequestHandler = (req, res) => {
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

    const category = expenseCategoryService.findByID(id)
    if (!category) {
        res.status(404).json({ error: "Expense category not found" })
        return
    }

    res.status(200).json(category.toJSON())
}
