import Goal from "../Goal";
import GoalRepository from "./GoalRepository";
import User from "../User";
import GoalStatus from "@/enums/GoalStatus";

class GoalService {
    private repository: GoalRepository;

    constructor() {
        this.repository = new GoalRepository();
    }

    public addGoal(user: User, title: string, description: string, target: number, status: GoalStatus): void {
        const goal = new Goal(title, user, description, target, status);
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

        this.repository.update(id, goal);
    }

    public deleteGoal(id: string): void {
        this.repository.delete(id);
    }

    public getAllGoalsByUser(user: User): Goal[] {
        return this.repository.findByUser(user.getUserID());
    }
}

export default GoalService;
