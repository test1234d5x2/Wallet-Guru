import UserStatus from '@/enums/UserStatus'
import uuid from 'react-native-uuid'

class User {
    private id: string
    private username: string
    private password: string
    private dateJoined: Date
    private status: UserStatus

    constructor(username: string, password: string) {
        this.id = uuid.v4()
        this.username = username
        this.password = password
        this.dateJoined = new Date()
        this.status = UserStatus.PENDING
    }

    public getUserID(): string { return this.id }

    public getEmail(): string { return this.username }

    public getPassword(): string { return this.password }

    public getDateJoined(): Date { return this.dateJoined }

    public setUserStatus(newStatus: UserStatus): void { this.status = newStatus }

    public getUserStatus(): UserStatus { return this.status }

}

export default User