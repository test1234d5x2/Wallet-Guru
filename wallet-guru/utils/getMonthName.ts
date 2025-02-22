export default function getMonthName(date: Date): string {
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
    return formatter.format(date);
}