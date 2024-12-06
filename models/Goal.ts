import User from "./User";
import uuid from 'react-native-uuid';

export class Goal {
    id: string
    user: User
    name: string
    description: string
    target: number
    status: GoalStatus

    constructor(name: string, user: User, description: string, target: number, status: GoalStatus) {
        this.id = uuid.v4()
        this.user = user
        this.name = name
        this.description = description
        this.target = target
        this.status = status
    }

}

export enum GoalStatus {
    Active = "Active",
    Completed = "Completed",
    Archived = "Archived",
}
