import Frequency from '../../enums/Frequency'

// Website: https://date-fns.org
// Date Accessed: 2/4/2025
import { addDays, addWeeks, addMonths, addYears } from 'date-fns'
import toUTC from './toUTC'

export default abstract class RecurrenceRule {
    frequency: Frequency
    interval: number
    startDate: Date
    nextTriggerDate: Date
    endDate?: Date

    constructor(frequency: Frequency, interval: number, startDate: Date, nextTriggerDate?: Date, endDate?: Date) {
        this.frequency = frequency
        this.interval = interval
        this.startDate = startDate
        this.nextTriggerDate = nextTriggerDate || startDate
        this.endDate = endDate

        this.nextTriggerDate = toUTC(this.nextTriggerDate)
    }

    public shouldEnd(): boolean {
        if (this.endDate) {
            return this.nextTriggerDate > this.endDate
        }

        return false
    }

    public shouldTrigger(): boolean {
        const now = new Date()
        return now >= this.nextTriggerDate
    }

    public computeNextTriggerDate(): Date {
        const now = new Date()

        while (this.nextTriggerDate <= now) {
            switch (this.frequency) {
                case Frequency.Daily:
                    this.nextTriggerDate = addDays(this.nextTriggerDate, this.interval)
                    break
                case Frequency.Weekly:
                    this.nextTriggerDate = addWeeks(this.nextTriggerDate, this.interval)
                    break
                case Frequency.Monthly:
                    this.nextTriggerDate = addMonths(this.nextTriggerDate, this.interval)
                    break
                case Frequency.Yearly:
                    this.nextTriggerDate = addYears(this.nextTriggerDate, this.interval)
                    break
                default:
                    throw new Error('Unsupported frequency')
            }
        }

        return this.nextTriggerDate
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
