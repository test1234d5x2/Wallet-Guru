import Goal from "../models/core/Goal"

class GoalRepository {
    private goals: Goal[] = []

    public add(goal: Goal): void {
        const exists = this.goals.some(g => g.getID() === goal.getID())
        if (exists) {
            throw new Error(`Goal already exists`)
        }
        this.goals.push(goal)
    }

    public delete(id: string): void {
        const index = this.goals.findIndex(g => g.getID() === id)
        if (index === -1) {
            throw new Error(`Goal not found`)
        }
        this.goals.splice(index, 1)
    }

    public findByUser(userID: string): Goal[] {
        return this.goals.filter(g => g.getUserID() === userID)
    }

    public findById(id: string): Goal | undefined {
        return this.goals.find(g => g.getID() === id)
    }
}

export default GoalRepository
