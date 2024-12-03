import User from "./User";
import { v4 as uuid4 } from "uuid";


export class Goal {
    id: string
    user: User
    name: string
    description: string
    target: number
    status: GoalStatus

    constructor(name: string, user: User, description: string, target: number, status: GoalStatus) {
        this.id = uuid4()
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
