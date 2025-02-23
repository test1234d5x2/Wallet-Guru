import GoalStatus from "../enums/GoalStatus";
import uuid from 'react-native-uuid';

export default class Goal {
    private id: string;
    private userID: string;
    title: string;
    description: string;
    target: number;
    current: number;
    status: GoalStatus;

    constructor(title: string, userID: string, description: string, target: number, status: GoalStatus, id?: string, current?: number) {
        this.id = id || uuid.v4();
        this.userID = userID;
        this.title = title;
        this.description = description;
        this.target = target;
        this.current = current || 0;
        this.status = status;
    }

    getID(): string {
        return this.id;
    }

    getUserID(): string {
        return this.userID;
    }

    updateCurrent(figure: number): void {
        this.current += figure;
    }

    calculateProgress(): number {
        return this.current / this.target;
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            title: this.title,
            description: this.description,
            target: this.target,
            current: this.current,
            status: this.status,
        }
    }
}
