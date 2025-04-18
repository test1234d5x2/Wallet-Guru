import { RequestHandler } from "express"
import Registry from "../registry/Registry"
import getUserFromToken from "../utils/getUserFromToken"

export const create: RequestHandler = async (req, res) => {
    const { name, colour } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to create an income category." })
        return
    }

    if (!name || !colour) {
        res.status(400).json({ error: "Missing required fields: name, colour" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeCategoryService = registry.incomeCategoryService

    const added = await incomeCategoryService.addIncomeCategory(userID, name, colour)
    if (added) {
        res.status(201).json({ message: "Income category created" })
    } else {
        res.status(500).json({ message: "Failed to add the income category." })
    }
}

export const update: RequestHandler = async (req, res) => {
    const { id } = req.params
    const { name, colour } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to update an income category." })
        return
    }

    if (!id || !name || !colour) {
        res.status(400).json({ error: "Missing required fields: id, name, colour" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeCategoryService = registry.incomeCategoryService

    const updated = await incomeCategoryService.updateIncomeCategory(id, userID, name, colour)
    if (updated) {
        res.status(200).json({ message: "Income category updated" })
    } else {
        res.status(404).json({ message: "Failed to update the income category." })
    }
}

export const remove: RequestHandler = async (req, res) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to delete an income category." })
        return
    }

    if (!id) {
        res.status(400).json({ error: "Income category id is required" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeCategoryService = registry.incomeCategoryService

    const deleted = await incomeCategoryService.deleteIncomeCategory(id, userID)
    if (deleted) {
        res.status(200).json({ message: "Income category deleted" })
    } else {
        res.status(404).json({ message: "Failed to remove income category." })
    }
}

export const listByUser: RequestHandler = async (req, res) => {
    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view income categories." })
        return
    }

    const registry = await Registry.getInstance()
    const incomeCategoryService = registry.incomeCategoryService

    const categories = await incomeCategoryService.getAllCategoriesByUser(userID)
    res.status(200).json({ categories })
}

export const findByID: RequestHandler = async (req, res) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view an income category." })
        return
    }

    if (!id) {
        res.status(400).json({ error: "Income category id is required" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeCategoryService = registry.incomeCategoryService

    const category = await incomeCategoryService.findByID(id, userID)
    if (!category) {
        res.status(404).json({ error: "Income category not found" })
        return
    }

    res.status(200).json(category.toJSON())
}
