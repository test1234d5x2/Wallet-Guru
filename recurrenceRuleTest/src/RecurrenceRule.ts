import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import Frequency from "./Frequency";

export default abstract class RecurrenceRule {
    frequency: Frequency;
    interval: number;
    startDate: Date;
    nextTriggerDate: Date;
    endDate?: Date;

    constructor(frequency: Frequency, interval: number, startDate: Date, endDate?: Date) {
        this.frequency = frequency;
        this.interval = interval;
        this.startDate = startDate;
        this.endDate = endDate;

        this.nextTriggerDate = new Date(Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
            startDate.getUTCHours(),
            startDate.getUTCMinutes(),
            startDate.getUTCSeconds(),
        ));
    }

    public shouldEnd(): boolean {
        if (this.endDate) {
            return this.nextTriggerDate > this.endDate;
        }

        return false;
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
                    this.nextTriggerDate = addDays(this.nextTriggerDate, this.interval)
                    break;
                case Frequency.Weekly:
                    this.nextTriggerDate = addWeeks(this.nextTriggerDate, this.interval)
                    break;
                case Frequency.Monthly:
                    this.nextTriggerDate = addMonths(this.nextTriggerDate, this.interval)
                    break;
                case Frequency.Yearly:
                    this.nextTriggerDate = addYears(this.nextTriggerDate, this.interval)
                    break;
                default:
                    throw new Error("Unsupported frequency");
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