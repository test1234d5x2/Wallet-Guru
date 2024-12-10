import User from "./User";
import GoalStatus from "@/enums/GoalStatus";
import uuid from 'react-native-uuid';

export default class Goal {
    id: string
    user: User
    title: string
    description: string
    target: number
    current: number
    status: GoalStatus

    constructor(title: string, user: User, description: string, target: number, status: GoalStatus) {
        this.id = uuid.v4()
        this.user = user
        this.title = title
        this.description = description
        this.target = target
        this.current = 0
        this.status = status
    }

    updateCurrent(figure: number): boolean {
        this.current += figure
        return true
    }

    calculateProgress(): number {
        return this.current / this.target
    }
}