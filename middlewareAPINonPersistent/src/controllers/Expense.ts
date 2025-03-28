import { RequestHandler } from "express"
import Registry from "../registry/Registry"
import getUserFromToken from "../utils/getUserFromToken"

const registry = Registry.getInstance()
const expenseCategoryService = registry.expenseCategoryService
const expenseService = registry.expenseService

export const create: RequestHandler = (req, res) => {
    const { title, amount, date, notes, expenseCategoryID, receipt } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to create an expense." })
        return
    }

    const expenseCategory = expenseCategoryService.findByID(expenseCategoryID)
    if (!expenseCategory) {
        res.status(404).json({ message: "The expense category could not be found." })
        return
    }

    if (!title || amount === undefined || !date || !expenseCategoryID) {
        res.status(400).json({ message: "Missing required fields" })
        return
    }

    expenseService.addExpense(
        userID,
        title,
        amount,
        new Date(date),
        notes,
        expenseCategoryID,
        receipt
    )
    res.status(201).json({ message: "Expense created" })
}

export const update: RequestHandler = (req, res) => {
    const { id } = req.params
    const { title, amount, date, notes, expenseCategoryID, receipt } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to update an expense." })
        return
    }

    const expenseCategory = expenseCategoryService.findByID(expenseCategoryID)
    if (!expenseCategory) {
        res.status(404).json({ error: "The expense category could not be found." })
        return
    }

    if (!id || !title || amount === undefined || !date || !expenseCategoryID) {
        res.status(400).json({ error: "Missing required fields" })
        return
    }

    expenseService.updateExpense(
        id,
        title,
        amount,
        new Date(date),
        notes,
        expenseCategoryID,
        receipt
    )
    res.status(200).json({ message: "Expense updated" })
}

export const remove: RequestHandler = (req, res) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to delete an expense." })
        return
    }

    if (!id) {
        res.status(400).json({ error: "Expense id is required" })
        return
    }

    expenseService.deleteExpense(id)
    res.status(200).json({ message: "Expense deleted" })
}

export const listByUser: RequestHandler = (req, res) => {
    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view expenses." })
        return
    }

    const expenses = expenseService.getAllExpensesByUser(userID)
    res.status(200).json({ expenses })
}

export const findByID: RequestHandler = (req, res) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ message: "You must be logged in to view an expense." })
        return
    }

    if (!id) {
        res.status(400).json({ message: "Expense ID is required." })
        return
    }

    const expense = expenseService.findByID(id)
    if (!expense) {
        res.status(404).json({ message: "Expense not found." })
        return
    }

    res.status(200).json(expense.toJSON())
}
