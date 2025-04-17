import { RequestHandler } from "express"
import Registry from "../registry/Registry"
import getUserFromToken from "../utils/getUserFromToken"

const registry = Registry.getInstance()
const incomeService = registry.incomeService

export const create: RequestHandler = (req, res) => {
    const { title, amount, date, notes, categoryID } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to create an income transaction." })
        return
    }

    if (!title || amount === undefined || !date || !categoryID) {
        res.status(400).json({ message: "Missing required fields: title, amount, date, categoryID" })
        return
    }

    incomeService.addIncome(userID, title, amount, new Date(date), notes, categoryID)
    res.status(201).json({ message: "Income created" })
}

export const update: RequestHandler = (req, res) => {
    const { id } = req.params
    const { title, amount, date, notes, categoryID } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to update your income transaction." })
        return
    }

    if (!id || !title || amount === undefined || !date || !categoryID) {
        res.status(400).json({ error: "Missing required fields: id, title, amount, date, categoryID" })
        return
    }

    incomeService.updateIncome(id, title, amount, new Date(date), notes, categoryID)
    res.status(200).json({ message: "Income updated" })
}

export const remove: RequestHandler = (req, res) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to remove your income transaction." })
        return
    }

    if (!id) {
        res.status(400).json({ error: "Income id is required" })
        return
    }

    incomeService.deleteIncome(id)
    res.status(200).json({ message: "Income deleted" })
}

export const listByUser: RequestHandler = (req, res) => {
    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view income transactions." })
        return
    }

    const incomes = incomeService.getAllIncomesByUser(userID)
    res.status(200).json({ incomes })
}

export const findByID: RequestHandler = (req, res) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to view an income transaction." })
        return
    }

    if (!id) {
        res.status(400).json({ message: "Income ID is required." })
        return
    }

    const income = incomeService.findByID(id)
    if (!income) {
        res.status(404).json({ message: "Income transaction not found." })
        return
    }

    res.status(200).json(income.toJSON())
}
