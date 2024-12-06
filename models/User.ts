import uuid from 'react-native-uuid';

class User {
    private id: string
    private username: string
    private password: string

    constructor(username: string, password: string) {
        this.id = uuid.v4()
        this.username = username
        this.password = password
    }

    public getUserID(): string {return this.id}

    public deleteUser(): boolean {return false}

    
}

export default User;