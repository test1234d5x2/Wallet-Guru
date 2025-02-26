import Frequency from '../enums/Frequency';
import RecurrenceRule from './RecurrenceRule';

export default class BasicRecurrenceRule extends RecurrenceRule {
    constructor(frequency: Frequency, interval: number, startDate: Date, endDate?: Date) {
        super(frequency, interval, startDate, endDate);
    }
}