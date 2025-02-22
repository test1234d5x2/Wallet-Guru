import Goal from "../models/Goal";
import GoalRepository from "../repositories/GoalRepository";
import GoalStatus from "../enums/GoalStatus";

class GoalService {
    private repository: GoalRepository;

    constructor() {
        this.repository = new GoalRepository();
    }

    public addGoal(userID: string, title: string, description: string, target: number, status: GoalStatus): void {
        const goal = new Goal(title, userID, description, target, status);
        this.repository.add(goal);
    }

    public updateGoal(id: string, title: string, description: string, target: number, current: number, status: GoalStatus): void {
        const goal = this.repository.findById(id);
        if (!goal) {
            throw new Error(`Goal does not exist`);
        }
        goal.title = title;
        goal.description = description;
        goal.target = target;
        goal.current = current;
        goal.status = status;
    }

    public deleteGoal(id: string): void {
        this.repository.delete(id);
    }

    public getAllGoalsByUser(userID: string): Goal[] {
        return this.repository.findByUser(userID);
    }

    public findByID(id: string): Goal | undefined {
        return this.repository.findById(id);
    }
}

export default GoalService;
