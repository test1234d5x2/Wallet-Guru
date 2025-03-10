import { RequestHandler } from "express"
import Registry from "../registry/Registry"
import GoalStatus from "../enums/GoalStatus"
import getUserFromToken from "../utils/getUserFromToken"

export const create: RequestHandler = async (req, res) => {
    const { title, description, target, targetDate, status } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to create a goal." })
        return
    }

    if (!title || !description || target === undefined) {
        res.status(400).json({ error: "Missing required fields: title, description, target" })
        return
    }

    const registry = await Registry.getInstance()
    const goalService = registry.goalService

    const added = await goalService.addGoal(userID, title, description, target, targetDate, status || GoalStatus.Active)
    if (added) {
        res.status(201).json({ message: "Goal created" })
    } else {
        res.status(404).json({ message: "Failed to create goal." })
    }
}

export const updateProgress: RequestHandler = async (req, res) => {
    const { id } = req.params
    const { current } = req.body

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to update a goal." })
        return
    }

    if (!id || current === undefined) {
        res.status(400).json({ error: "Missing required fields: id, current" })
        return
    }

    const registry = await Registry.getInstance()
    const goalService = registry.goalService

    const updated = await goalService.updateGoalProgress(id, userID, current)
    if (updated) {
        res.status(200).json({ message: "Goal progress updated" })
    } else {
        res.status(404).json({ message: "Failed to update goal progress." })
    }
}

export const archive: RequestHandler = async (req, res) => {
    return
}

export const remove: RequestHandler = async (req, res) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to delete a goal." })
        return
    }

    if (!id) {
        res.status(400).json({ error: "Goal id is required" })
        return
    }

    const registry = await Registry.getInstance()
    const goalService = registry.goalService

    const deleted = await goalService.deleteGoal(id, userID)
    if (deleted) {
        res.status(200).json({ message: "Goal deleted" })
    } else {
        res.status(404).json({ error: "Error deleting goal" })
    }
}

export const listByUser: RequestHandler = async (req, res) => {
    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view goals." })
        return
    }

    const registry = await Registry.getInstance()
    const goalService = registry.goalService

    const goals = await goalService.getAllGoalsByUser(userID)
    res.status(200).json({ goals })
}

export const findByID: RequestHandler = async (req, res) => {
    const { id } = req.params

    const userID = getUserFromToken(req)
    if (!userID) {
        res.status(401).json({ error: "You must be logged in to view a goal." })
        return
    }

    if (!id) {
        res.status(400).json({ error: "Goal ID is required." })
        return
    }

    const registry = await Registry.getInstance()
    const goalService = registry.goalService

    const goal = await goalService.findByID(id, userID)
    if (!goal) {
        res.status(404).json({ error: "Goal not found." })
        return
    }

    res.status(200).json(goal.toJSON())
}
