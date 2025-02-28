export default function getMonthNameShort(date: Date): string {
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
    return formatter.format(date);
}