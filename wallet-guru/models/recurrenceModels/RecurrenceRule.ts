import RecurrencePeriods from "@/enums/RecurrencePeriods";

export default abstract class RecurrenceRule {
    frequency: RecurrencePeriods;
    interval: number;
    startDate: Date;
    nextTriggerDate: Date;
    endDate?: Date;

    constructor(frequency: RecurrencePeriods, interval: number, startDate: Date, nextTriggerDate: Date, endDate?: Date) {
        this.frequency = frequency;
        this.interval = interval;
        this.startDate = startDate;
        this.nextTriggerDate = nextTriggerDate;
        this.endDate = endDate;
    }

    public shouldTrigger(): boolean {
        const now = new Date();
        return now >= this.nextTriggerDate;
    }

    public computeNextTriggerDate(): Date {
        let nextDate = new Date(this.nextTriggerDate);
        switch (this.frequency) {
            case RecurrencePeriods.Daily:
                nextDate.setDate(nextDate.getDate() + this.interval);
                break;
            case RecurrencePeriods.Weekly:
                nextDate.setDate(nextDate.getDate() + this.interval * 7);
                break;
            case RecurrencePeriods.Monthly:
                nextDate.setMonth(nextDate.getMonth() + this.interval);
                break;
            case RecurrencePeriods.Yearly:
                nextDate.setFullYear(nextDate.getFullYear() + this.interval);
                break;
            default:
                throw new Error("Unsupported frequency");
        }

        if (this.endDate && nextDate > this.endDate) {
            throw new Error("Next trigger date exceeds end date");
        }
        return nextDate;
    }

    public toJSON() {
        return {
            frequency: this.frequency,
            interval: this.interval,
            startDate: this.startDate,
            nextTriggerDate: this.nextTriggerDate,
            endDate: this.endDate,
        }
    }
}