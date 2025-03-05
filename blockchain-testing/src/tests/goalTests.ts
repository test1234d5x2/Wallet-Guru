import Goal from "../models/core/Goal";


export function testGoalDetails(data: Goal, expected: Goal): boolean {
    let result = true

    console.log(`ID: ${data.getID()} === ${expected.getID()}`)

    if (data.getID() !== expected.getID()) {
        result = false;
    }

    console.log(`User ID: ${data.getUserID()} === ${expected.getUserID()}`)

    if (data.getUserID() !== expected.getUserID()) {
        result = false;
    }

    console.log(`Title: ${data.title} === ${expected.title}`)

    if (data.title !== expected.title) {
        result = false;
    }

    console.log(`Description: ${data.description} === ${expected.description}`)

    if (data.description !== expected.description) {
        result = false;
    }

    console.log(`Target: ${data.target} === ${expected.target}`)

    if (data.target !== expected.target) {
        result = false;
    }

    console.log(`Target Date: ${data.targetDate.toISOString()} === ${expected.targetDate.toISOString()}`)

    if (data.targetDate.getTime() !== expected.targetDate.getTime()) {
        result = false;
    }

    console.log(`Current: ${data.current} === ${expected.current}`)

    if (data.current !== expected.current) {
        result = false;
    }

    console.log(`Status: ${data.status} === ${expected.status}`)

    if (data.status !== expected.status) {
        result = false;
    }

    return result
}