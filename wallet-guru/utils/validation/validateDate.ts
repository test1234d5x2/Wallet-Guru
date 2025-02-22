export function isTodayOrBefore(date: Date): boolean {
    const today = normaliseDateStartTime(new Date())
    date = normaliseDateStartTime(date)

    return date <= today
}

export function isTodayOrAfter(date: Date): boolean {
    const today = normaliseDateStartTime(new Date())
    date = normaliseDateStartTime(date)

    return date >= today
}

export function isValidDate(date: Date): boolean {
    return !isNaN(date.getTime())
}

function normaliseDateStartTime(date: Date): Date {
    const normalisedDate = new Date(date);
    normalisedDate.setHours(0, 0, 0, 0)
    return normalisedDate
}