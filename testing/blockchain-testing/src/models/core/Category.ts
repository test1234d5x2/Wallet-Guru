import { v4 } from 'uuid'

export default abstract class Category {
    protected id: string;
    protected userID: string;
    public name: string;
    public colour: string;

    constructor(userID: string, name: string, id?: string, colour?: string) {
        this.id = id || v4()
        this.userID = userID
        this.name = name
        this.colour = colour || '#FFFFFF'
    }

    public getID(): string {
        return this.id
    }

    public getUserID(): string {
        return this.userID
    }

    public toJSON() {
        return {
            id: this.id,
            userID: this.userID,
            name: this.name,
            colour: this.colour,
        };
    }
}