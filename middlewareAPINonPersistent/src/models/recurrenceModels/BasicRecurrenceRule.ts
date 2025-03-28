import Frequency from '../../enums/Frequency'
import RecurrenceRule from './RecurrenceRule'

export default class BasicRecurrenceRule extends RecurrenceRule {
    constructor(frequency: Frequency, interval: number, startDate: Date, nextTriggerDate?: Date, endDate?: Date) {
        super(frequency, interval, startDate, nextTriggerDate, endDate)
    }
}