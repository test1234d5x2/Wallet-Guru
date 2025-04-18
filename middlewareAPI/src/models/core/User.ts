import { v4 } from "uuid"
import UserStatus from "../../enums/UserStatus"

class User {
    private id: string
    private username: string
    private password: string
    private dateJoined: Date
    private status: UserStatus

    constructor(username: string, password: string, id?: string, dateJoined?: Date, status?: UserStatus) {
        this.id = id || v4()
        this.username = username
        this.password = password 
        this.dateJoined = dateJoined || new Date()
        this.status = status || UserStatus.PENDING
    }

    public getUserID(): string { return this.id }
    public getEmail(): string { return this.username }
    public getPassword(): string { return this.password }
    public getDateJoined(): Date { return this.dateJoined }
    public setUserStatus(newStatus: UserStatus): void { this.status = newStatus }
    public getUserStatus(): UserStatus { return this.status }
}

export default User
