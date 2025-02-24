import Frequency from "@/enums/Frequency";

export default abstract class RecurrenceRule {
    frequency: Frequency;
    interval: number;
    startDate: Date;
    nextTriggerDate: Date;
    endDate?: Date;

    constructor(frequency: Frequency, interval: number, startDate: Date, nextTriggerDate?: Date, endDate?: Date) {
        this.frequency = frequency;
        this.interval = interval;
        this.startDate = startDate;
        this.nextTriggerDate = nextTriggerDate || startDate;
        this.endDate = endDate;
    }

    public shouldTrigger(): boolean {
        const now = new Date();
        return now >= this.nextTriggerDate;
    }

    public computeNextTriggerDate(): Date {
        let nextDate = new Date(this.nextTriggerDate);
        switch (this.frequency) {
            case Frequency.Daily:
                nextDate.setDate(nextDate.getDate() + this.interval);
                break;
            case Frequency.Weekly:
                nextDate.setDate(nextDate.getDate() + this.interval * 7);
                break;
            case Frequency.Monthly:
                nextDate.setMonth(nextDate.getMonth() + this.interval);
                break;
            case Frequency.Yearly:
                nextDate.setFullYear(nextDate.getFullYear() + this.interval);
                break;
            default:
                throw new Error("Unsupported frequency");
        }

        if (this.endDate && nextDate > this.endDate) {
            throw new Error("Next trigger date exceeds end date");
        }

        this.nextTriggerDate = nextDate;

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