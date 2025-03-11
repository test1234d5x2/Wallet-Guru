import User from "../models/core/User"

export function testUserDetails(data: User, expected: User): boolean {
    let result = true

    console.log(`ID: ${data.getUserID()} === ${expected.getUserID()}`)

    if (data.getUserID() !== expected.getUserID()) {
        result = false
    }

    console.log(`Email: ${data.getEmail()} === ${expected.getEmail()}`)

    if (data.getEmail() !== expected.getEmail()) {
        result = false
    }

    console.log(`Password: ${data.getPassword()} === ${expected.getPassword()}`)

    if (data.getPassword() !== expected.getPassword()) {
        result = false
    }

    console.log(`Date Joined: ${data.getDateJoined().toISOString()} === ${expected.getDateJoined().toISOString()}`)

    if (data.getDateJoined().getTime() !== expected.getDateJoined().getTime()) {
        result = false
    }

    console.log(`User Status: ${data.getUserStatus()} === ${expected.getUserStatus()}`)

    if (data.getUserStatus() !== expected.getUserStatus()) {
        result = false
    }

    return result
}
