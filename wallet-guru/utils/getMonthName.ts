export default function getMonthName(date: Date, format: "long"|"short"="long"): string {
    const formatter = new Intl.DateTimeFormat('en-US', { month: format });
    return formatter.format(date);
}