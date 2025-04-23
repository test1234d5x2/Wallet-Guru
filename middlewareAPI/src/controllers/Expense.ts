import { RequestHandler } from "express"
import Registry from "../registry/Registry"
import getUserFromToken from "../utils/getUserFromToken"

export const create: RequestHandler = async (req, res) => {
    const { title, amount, date, notes, expenseCategoryID, receipt } = req.body

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    if (!title || amount === undefined || !date || !expenseCategoryID) {
        res.status(400).json({ message: "Missing required fields" })
        return
    }

    const registry = await Registry.getInstance()
    const expenseCategoryService = registry.expenseCategoryService
    const expenseService = registry.expenseService

    const expenseCategory = await expenseCategoryService.findByID(email, expenseCategoryID, userID)
    if (!expenseCategory) {
        res.status(404).json({ message: "The expense category could not be found." })
        return
    }

    const added = await expenseService.addExpense(email, userID, title, amount, new Date(date), notes, expenseCategoryID, receipt)
    if (added) {
        res.status(201).json({ message: "Expense created" })
    } else {
        res.status(404).json({ message: "Failed to add expense." })
    }
}

export const update: RequestHandler = async (req, res) => {
    const { id } = req.params
    const { title, amount, date, notes, expenseCategoryID, receipt } = req.body

    const userDetails = getUserFromToken(req)
    if (!userDetails) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const {email, userID} = userDetails

    if (!id || !title || amount === undefined || !date || !expenseCategoryID) {
        res.status(400).json({ error: "Missing required fields" })
        return
    }

    const registry = await Registry.getInstance()
    const expenseCategoryService = registry.expenseCategoryService
    const expenseService = registry.expenseService

    const expenseCategory = await expenseCategoryService.findByID(email, expenseCategoryID, userID)
    if (!expenseCategory) {
        res.status(404).json({ error: "The expense category could not be found." })
        return
    }

    const updated = await expenseService.updateExpense(email, id, userID, title, amount, new Date(date), notes, expenseCategoryID, receipt)
    if (updated) {
        res.status(200).json({ message: "Expense updated" })
    } else {
        res.status(404).json({ message: "Failed to update expense" })
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
        res.status(400).json({ error: "Expense id is required" })
        return
    }

    const registry = await Registry.getInstance()
    const expenseService = registry.expenseService

    const deleted = await expenseService.deleteExpense(email, id, userID)
    if (deleted) {
        res.status(200).json({ message: "Expense deleted" })
    } else {
        res.status(404).json({ message: "Failed to delete expense." })
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
    const expenseService = registry.expenseService

    const expenses = await expenseService.getAllExpensesByUser(email, userID)
    res.status(200).json({ expenses })
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
        res.status(400).json({ message: "Expense ID is required." })
        return
    }

    const registry = await Registry.getInstance()
    const expenseService = registry.expenseService

    const expense = await expenseService.findByID(email, id, userID)
    if (!expense) {
        res.status(404).json({ message: "Expense not found." })
        return
    }

    res.status(200).json(expense.toJSON())
}
