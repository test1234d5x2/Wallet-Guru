import Frequency from "../../enums/Frequency";

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
        this.endDate = endDate;

        this.nextTriggerDate = nextTriggerDate || new Date(Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
        ));
    }

    public shouldTrigger(): boolean {
        const now = new Date();
        return now >= this.nextTriggerDate;
    }

    public computeNextTriggerDate(): Date {
        const now = new Date(Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth(),
            new Date().getUTCDate(),
        ));

        while (this.nextTriggerDate <= now) {
            switch (this.frequency) {
                case Frequency.Daily:
                    this.nextTriggerDate.setUTCDate(this.nextTriggerDate.getUTCDate() + this.interval);
                    break;
                case Frequency.Weekly:
                    this.nextTriggerDate.setUTCDate(this.nextTriggerDate.getUTCDate() + this.interval * 7);
                    break;
                case Frequency.Monthly:
                    this.nextTriggerDate.setUTCMonth(this.nextTriggerDate.getUTCMonth() + this.interval);
                    break;
                case Frequency.Yearly:
                    this.nextTriggerDate.setUTCFullYear(this.nextTriggerDate.getUTCFullYear() + this.interval);
                    break;
                default:
                    throw new Error("Unsupported frequency");
            }

            if (this.endDate && this.nextTriggerDate > this.endDate) {
                throw new Error("Next trigger date exceeds end date");
            }
        }

        return this.nextTriggerDate;
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