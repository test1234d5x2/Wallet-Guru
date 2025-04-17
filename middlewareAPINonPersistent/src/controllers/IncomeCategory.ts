import { RequestHandler } from "express"
import Registry from "../registry/Registry"
import getUserFromToken from "../utils/getUserFromToken"

const registry = Registry.getInstance()
const incomeCategoryService = registry.incomeCategoryService

export const create: RequestHandler = (req, res) => {
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

    incomeCategoryService.addIncomeCategory(userID, name, colour)
    res.status(201).json({ message: "Income category created" })
}

export const update: RequestHandler = (req, res) => {
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

    incomeCategoryService.updateIncomeCategory(id, name, colour)
    res.status(200).json({ message: "Income category updated" })
}

export const remove: RequestHandler = (req, res) => {
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

    incomeCategoryService.deleteIncomeCategory(id)
    res.status(200).json({ message: "Income category deleted" })
}

export const listByUser: RequestHandler = (req, res) => {
    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view income categories." })
        return
    }

    const categories = incomeCategoryService.getAllCategoriesByUser(userID)
    res.status(200).json({ categories })
}

export const findByID: RequestHandler = (req, res) => {
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

    const category = incomeCategoryService.findByID(id)
    if (!category) {
        res.status(404).json({ error: "Income category not found" })
        return
    }

    res.status(200).json(category.toJSON())
}
