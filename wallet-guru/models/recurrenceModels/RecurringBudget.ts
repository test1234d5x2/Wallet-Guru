import RecurrencePeriods from '@/enums/RecurrencePeriods';
import RecurrenceRule from './RecurrenceRule';

export default class RecurringBudget extends RecurrenceRule {
    constructor(frequency: RecurrencePeriods, interval: number, startDate: Date, nextTriggerDate: Date, endDate?: Date) {
        super(frequency, interval, startDate, nextTriggerDate, endDate);
    }
}