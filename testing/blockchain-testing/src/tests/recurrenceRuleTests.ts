import RecurrenceRule from "../models/recurrenceModels/RecurrenceRule"
import toUTC from "./toUTC"

export default function testRecurrenceRuleDetails(data: RecurrenceRule, expected: RecurrenceRule): boolean {
    let result = true

    console.log(`Recurrence Rule Frequency: ${data.frequency} === ${expected.frequency}`)

    if (data.frequency !== expected.frequency) {
        result = false
    }

    console.log(`Recurrence Rule Interval: ${data.interval} === ${expected.interval}`)

    if (data.interval !== expected.interval) {
        result = false
    }

    console.log(`Recurrence Rule Start Date : ${toUTC(data.startDate).toUTCString()} === ${toUTC(expected.startDate).toUTCString()}`)

    if (toUTC(data.startDate).toUTCString() !== toUTC(expected.startDate).toUTCString()) {
        result = false
    }

    console.log(`Recurrence Rule Next Trigger Date: ${toUTC(data.nextTriggerDate).toUTCString()} === ${toUTC(expected.nextTriggerDate).toUTCString()}`)

    if (toUTC(data.nextTriggerDate).toUTCString() !== toUTC(expected.nextTriggerDate).toUTCString()) {
        result = false
    }

    if (!expected.endDate) {
        if (data.endDate) result = false
    }
    else {
        if (!data.endDate) {} 
        else {
            console.log(`Recurrence Rule End Date: ${toUTC(data.endDate).toUTCString()} === ${toUTC(expected.endDate).toUTCString()}`)
            if (toUTC(data.endDate).toUTCString() !== toUTC(expected.endDate).toUTCString()) {
                result = false
            }
        }
    }

    return result
}
