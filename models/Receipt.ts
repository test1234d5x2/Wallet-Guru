import uuid from 'react-native-uuid';


export default class Receipt {
    private id: string
    private url: string

    constructor(url: string) {
        this.id = uuid.v4()
        this.url = url
    }

    getID(): string {
        return this.id
    }

    getURL(): string {
        return this.url
    }
}