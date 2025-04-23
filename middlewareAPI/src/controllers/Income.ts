import { RequestHandler } from "express"
import Registry from "../registry/Registry-new"
import getUserFromToken from "../utils/getUserFromToken"

export const create: RequestHandler = async (req, res) => {
    const { title, amount, date, notes, categoryID } = req.body

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    if (!title || amount === undefined || !date || !categoryID) {
        res.status(400).json({ message: "Missing required fields: title, amount, date" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeService = registry.incomeService

    const added = await incomeService.addIncome(email, userID, title, amount, new Date(date), notes, categoryID)
    if (added) {
        res.status(201).json({ message: "Income created" })
    } else {
        res.status(404).json({ message: "Failed to add income." })
    }
}

export const update: RequestHandler = async (req, res) => {
    const { id } = req.params
    const { title, amount, date, notes, categoryID } = req.body

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    if (!id || !title || amount === undefined || !date || !categoryID) {
        res.status(400).json({ error: "Missing required fields: id, title, amount, date" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeService = registry.incomeService

    const updated = await incomeService.updateIncome(email, id, userID, title, amount, new Date(date), notes, categoryID)
    if (updated) {
        res.status(200).json({ message: "Income updated" })
    } else {
        res.status(404).json({ message: "Failed to update income." })
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
        res.status(400).json({ error: "Income id is required" })
        return
    }

    const registry = await Registry.getInstance()
    const incomeService = registry.incomeService

    const deleted = await incomeService.deleteIncome(email, id, userID)
    if (deleted) {
        res.status(200).json({ message: "Income deleted" })
    } else {
        res.status(404).json({ message: "Failed to delete income." })
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
    const incomeService = registry.incomeService

    const incomes = await incomeService.getAllIncomesByUser(email, userID)
    res.status(200).json({ incomes })
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
        res.status(400).json({ message: "Income ID is required." })
        return
    }

    const registry = await Registry.getInstance()
    const incomeService = registry.incomeService

    const income = await incomeService.findByID(email, id, userID)
    if (!income) {
        res.status(404).json({ message: "Income transaction not found." })
        return
    }

    res.status(200).json(income.toJSON())
}
