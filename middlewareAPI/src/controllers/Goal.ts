import { RequestHandler } from "express";
import Registry from "../registry/Registry";
import GoalStatus from "../enums/GoalStatus";
import getUserFromToken from "../utils/getUserFromToken";

const registry = Registry.getInstance();
const goalService = registry.goalService;


/**
 * Create a new goal.
 * Expected request body:
 * {
 *   "title": "Save for a Car",
 *   "description": "Saving money for a new car",
 *   "target": 10000,
 *   "status": "Active" // optional; defaults to Active if not provided
 * }
 */
export const create: RequestHandler = (req, res) => {
    const { title, description, target, status } = req.body;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({error: "You must be logged in to create a goal."})
        return;
    }

    if (!title || !description || target === undefined) {
        res.status(400).json({ error: "Missing required fields: user, title, description, target" });
        return;
    }
    try {
        goalService.addGoal(user, title, description, target, status || GoalStatus.Active);
        res.status(201).json({ message: "Goal created" });
    } catch (err: any) {
        res.status(500).json({ error: "Error creating goal", details: err.message });
    }
};

/**
 * Update a goal's current progress.
 * Expected request parameters:
 *   id: Goal identifier
 * Expected request body:
 * {
 *   "current": 500
 * }
 * This endpoint fetches the existing goal via getGoalById (see helper above) and then calls updateGoal
 * using the new current value while preserving the goal's title, description, target, and status.
 */
export const updateProgress: RequestHandler = (req, res) => {
    const { id } = req.params;
    const { current } = req.body;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({error: "You must be logged in to update a goal."})
        return;
    }

    if (!id || current === undefined) {
        res.status(400).json({ error: "Missing required fields: id, current" });
        return;
    }
    try {
        const goal = goalService.findByID(id);
        if (!goal) {
            res.status(404).json({ error: "Goal not found" });
            return;
        }
        goalService.updateGoal(
            id,
            goal.title,
            goal.description,
            goal.target,
            current,
            goal.status
        );
        res.status(200).json({ message: "Goal progress updated" });
    } catch (err: any) {
        res.status(500).json({ error: "Error updating goal progress", details: err.message });
    }
};

/**
 * Archive a goal.
 * Expected request parameters:
 *   id: Goal identifier
 * This endpoint fetches the existing goal and updates its status to Archived while preserving other fields.
 */
export const archive: RequestHandler = (req, res) => {
    const { id } = req.params;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({error: "You must be logged in to archive a goal."})
        return;
    }

    if (!id) {
        res.status(400).json({ error: "Goal id is required" });
        return;
    }
    try {
        const goal = goalService.findByID(id);
        if (!goal) {
            res.status(404).json({ error: "Goal not found" });
            return;
        }
        goalService.updateGoal(
            id,
            goal.title,
            goal.description,
            goal.target,
            goal.current,
            GoalStatus.Archived
        );
        res.status(200).json({ message: "Goal archived" });
    } catch (err: any) {
        res.status(500).json({ error: "Error archiving goal", details: err.message });
    }
};

/**
 * Delete a goal.
 * Expected request parameters:
 *   id: Goal identifier
 */
export const remove: RequestHandler = (req, res) => {
    const { id } = req.params;

    const user = getUserFromToken(req);
    if (!user) {
        res.status(401).json({error: "You must be logged in to delete a goal."})
        return;
    }

    if (!id) {
        res.status(400).json({ error: "Goal id is required" });
        return;
    }
    try {
        goalService.deleteGoal(id);
        res.status(200).json({ message: "Goal deleted" });
    } catch (err: any) {
        res.status(500).json({ error: "Error deleting goal", details: err.message });
    }
};
