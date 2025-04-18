import Frequency from "@/enums/Frequency"

export default function computeWindowStartFromWindowEnd(windowEnd: Date, f: Frequency, interval: number): Date {
    const windowStart = new Date(
        Date.UTC(
            windowEnd.getUTCFullYear(),
            windowEnd.getUTCMonth(),
            windowEnd.getUTCDate()
        )
    )

    switch (f) {
        case Frequency.Daily:
            windowStart.setUTCDate(windowStart.getUTCDate() - interval)
            break
        case Frequency.Weekly:
            windowStart.setUTCDate(windowStart.getUTCDate() - interval * 7)
            break
        case Frequency.Monthly:
            windowStart.setUTCMonth(windowStart.getUTCMonth() - interval)
            break
        case Frequency.Yearly:
            windowStart.setUTCFullYear(windowStart.getUTCFullYear() - interval)
            break
        default:
            throw new Error("Unsupported frequency")
    }

    return windowStart
}
