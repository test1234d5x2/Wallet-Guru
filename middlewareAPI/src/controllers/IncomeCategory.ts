import { RequestHandler } from "express"
import Registry from "../registry/Registry"
import getUserFromToken from "../utils/getUserFromToken"

export const create: RequestHandler = async (req, res) => {
    const { name, colour } = req.body

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    if (!name || !colour) {
        res.status(400).json({ error: "Missing required fields: name, colour" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeCategoryService = registry.incomeCategoryService

    const added = await incomeCategoryService.addIncomeCategory(email, userID, name, colour)
    if (added) {
        res.status(201).json({ message: "Income category created" })
    } else {
        res.status(500).json({ message: "Failed to add the income category." })
    }
}

export const update: RequestHandler = async (req, res) => {
    const { id } = req.params
    const { name, colour } = req.body

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    if (!id || !name || !colour) {
        res.status(400).json({ error: "Missing required fields: id, name, colour" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeCategoryService = registry.incomeCategoryService

    const updated = await incomeCategoryService.updateIncomeCategory(email, id, userID, name, colour)
    if (updated) {
        res.status(200).json({ message: "Income category updated" })
    } else {
        res.status(404).json({ message: "Failed to update the income category." })
    }
}

export const remove: RequestHandler = async (req, res) => {
    const { id } = req.params

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    if (!id) {
        res.status(400).json({ error: "Income category id is required" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeCategoryService = registry.incomeCategoryService

    const deleted = await incomeCategoryService.deleteIncomeCategory(email, id, userID)
    if (deleted) {
        res.status(200).json({ message: "Income category deleted" })
    } else {
        res.status(404).json({ message: "Failed to remove income category." })
    }
}

export const listByUser: RequestHandler = async (req, res) => {
    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    const registry = await Registry.getInstance()
    const incomeCategoryService = registry.incomeCategoryService

    const categories = await incomeCategoryService.getAllCategoriesByUser(email, userID)
    res.status(200).json({ categories })
}

export const findByID: RequestHandler = async (req, res) => {
    const { id } = req.params

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    if (!id) {
        res.status(400).json({ error: "Income category id is required" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeCategoryService = registry.incomeCategoryService

    const category = await incomeCategoryService.findByID(email, id, userID)
    if (!category) {
        res.status(404).json({ error: "Income category not found" })
        return
    }

    res.status(200).json(category.toJSON())
}
