export default function monthsPassedSinceJoinDate(dateJoined: Date): Date[] {
    const currentDate = new Date()
    const months = []

    let year = dateJoined.getFullYear()
    let month = dateJoined.getMonth()

    while (year < currentDate.getFullYear() || (year === currentDate.getFullYear() && month <= currentDate.getMonth())) {
        months.push(new Date(year, month, 1))
        month += 1

        if (month > 11) {
            month = 0
            year += 1
        }
    }

    return months
}
