import { v4 } from 'uuid'
import GoalStatus from '../../enums/GoalStatus'

export default class Goal {
    private id: string
    private userID: string
    title: string
    description: string
    target: number
    targetDate: Date
    current: number
    status: GoalStatus

    constructor(title: string, userID: string, description: string, target: number, targetDate: Date, status: GoalStatus, id?: string, current?: number) {
        this.id = id || v4()
        this.userID = userID
        this.title = title
        this.description = description
        this.target = target
        this.targetDate = targetDate
        this.current = current || 0
        this.status = status
    }

    getID(): string {
        return this.id
    }

    getUserID(): string {
        return this.userID
    }

    isTimeUp(): boolean {
        return new Date() >= this.targetDate
    }

    updateCurrent(figure: number) {
        this.current += figure
    }

    calculateProgress(): number {
        return this.current / this.target
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            title: this.title,
            description: this.description,
            target: this.target,
            targetDate: this.targetDate,
            current: this.current,
            status: this.status,
        }
    }
}
