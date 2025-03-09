import Frequency from './Frequency';
import BasicRecurrenceRule from "./BasicRecurrenceRule";
import { addMonths } from 'date-fns';

function inc() {
    while (!rule.shouldEnd()) {
        rule.computeNextTriggerDate();
        console.log(rule.nextTriggerDate)
    }
}


const startDate = new Date();
const rule = new BasicRecurrenceRule(Frequency.Monthly, 1, startDate, addMonths(startDate, 15));

console.log("Initial next trigger:", rule.nextTriggerDate.toISOString());

inc()