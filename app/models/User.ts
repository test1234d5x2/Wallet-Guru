import { v4 as uuid4 } from "uuid"

class User {
    private id: string
    private username: string
    private password: string

    constructor(username: string, password: string) {
        this.id = uuid4();
        this.username = username
        this.password = password
    }

    public getUserID(): string {return this.id}

    public deleteUser(): boolean {return false}

    
}

export default User;