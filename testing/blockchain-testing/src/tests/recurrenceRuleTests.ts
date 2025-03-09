import RecurrenceRule from "../models/recurrenceModels/RecurrenceRule";


export default function testRecurrenceRuleDetails(data: RecurrenceRule, expected: RecurrenceRule): boolean {
    let result = true

    console.log(`Recurrence Rule Frequency: ${data.frequency} === ${expected.frequency}`)

    if (data.frequency !== expected.frequency) {
        result = false;
    }

    console.log(`Recurrence Rule Interval: ${data.interval} === ${expected.interval}`)

    if (data.interval !== expected.interval) {
        result = false;
    }

    console.log(`Recurrence Rule Start Date : ${data.startDate.toISOString()} === ${expected.startDate.toISOString()}`)

    if (data.startDate.getTime() !== expected.startDate.getTime()) {
        result = false;
    }

    console.log(`Recurrence Rule Next Trigger Date: ${data.nextTriggerDate.toISOString()} === ${expected.nextTriggerDate.toISOString()}`)

    if (data.nextTriggerDate.getTime() !== expected.nextTriggerDate.getTime()) {
        result = false;
    }

    if (!expected.endDate) {
        if (data.endDate) result = false;
    }

    else {
        if (!data.endDate) {}
        else {
            console.log(`Recurrence Rule End Date: ${data.endDate.toISOString()} === ${expected.endDate.toISOString()}`)
            if (data.endDate.getTime() !== expected.endDate.getTime()) {
                result = false;
            }
        }
    }

    return result
}