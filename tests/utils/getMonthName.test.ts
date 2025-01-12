import getMonthName from "@/utils/getMonthName";


describe('getMonthName', () => {
    test('should return the correct month name for January', () => {
        const date = new Date(2023, 0, 1);
        const result = getMonthName(date);
        expect(result).toBe('January');
    });

    test('should return the correct month name for February', () => {
        const date = new Date(2023, 1, 1);
        const result = getMonthName(date);
        expect(result).toBe('February');
    });

    test('should return the correct month name for December', () => {
        const date = new Date(2023, 11, 1);
        const result = getMonthName(date);
        expect(result).toBe('December');
    });

    test('should handle leap years for February', () => {
        const date = new Date(2020, 1, 29);
        const result = getMonthName(date);
        expect(result).toBe('February');
    });

    test('should return the correct month name for a date in a different year', () => {
        const date = new Date(1999, 6, 15);
        const result = getMonthName(date);
        expect(result).toBe('July');
    });

    test('should return the correct month name for a date with a time component', () => {
        const date = new Date(2023, 2, 15, 14, 30);
        const result = getMonthName(date);
        expect(result).toBe('March');
    });
});
