import Frequency from './Frequency';
import BasicRecurrenceRule from "./BasicRecurrenceRule";

let numbers = [];

function inc() {
    if (rule.shouldTrigger()) {
        numbers.push(numbers.length + 1)
        rule.computeNextTriggerDate();
    }
    console.log(numbers);
}


const startDate = new Date();
const rule = new BasicRecurrenceRule(Frequency.Seconds, 15, startDate);

console.log("Initial next trigger:", rule.nextTriggerDate.toISOString());

const nextTrigger = rule.computeNextTriggerDate();
console.log("Computed next trigger:", nextTrigger.toISOString());

setInterval(inc, 5000)