import monthsPassedSinceJoinDate from "@/utils/monthsPassedSinceJoinDate";


describe('monthsPassedSinceJoinDate', () => {
    test('should return correct months for the same year', () => {
        const dateJoined = new Date(2023, 0, 15);
        const currentDate = new Date(2023, 2, 20);
        jest.useFakeTimers().setSystemTime(currentDate);

        const result = monthsPassedSinceJoinDate(dateJoined);
        const expected: Date[] = [
            new Date(2023, 0, 1),
            new Date(2023, 1, 1),
            new Date(2023, 2, 1),
        ];

        expect(result).toEqual(expected);

        jest.useRealTimers();
    });

    test('should return correct months for multiple years', () => {
        const dateJoined = new Date(2022, 10, 15);
        const currentDate = new Date(2023, 1, 20);
        jest.useFakeTimers().setSystemTime(currentDate);

        const result = monthsPassedSinceJoinDate(dateJoined);
        const expected: Date[] = [
            new Date(2022, 10, 1),
            new Date(2022, 11, 1),
            new Date(2023, 0, 1),
            new Date(2023, 1, 1),
        ];

        expect(result).toEqual(expected);

        jest.useRealTimers();
    });

    test('should return an empty array if the date joined is after the current date', () => {
        const dateJoined = new Date(2024, 0, 15);
        const currentDate = new Date(2023, 11, 31);
        jest.useFakeTimers().setSystemTime(currentDate);

        const result = monthsPassedSinceJoinDate(dateJoined);

        expect(result).toEqual([]);

        jest.useRealTimers();
    });

    test('should return one month if date joined is the current month', () => {
        const dateJoined = new Date(2023, 1, 1);
        const currentDate = new Date(2023, 1, 20);
        jest.useFakeTimers().setSystemTime(currentDate);

        const result = monthsPassedSinceJoinDate(dateJoined);
        const expected: Date[] = [new Date(2023, 1, 1)];

        expect(result).toEqual(expected);

        jest.useRealTimers();
    });

    test('should handle leap years correctly', () => {
        const dateJoined = new Date(2020, 1, 29);
        const currentDate = new Date(2020, 3, 15);
        jest.useFakeTimers().setSystemTime(currentDate);

        const result = monthsPassedSinceJoinDate(dateJoined);
        const expected: Date[] = [
            new Date(2020, 1, 1),
            new Date(2020, 2, 1),
            new Date(2020, 3, 1),
        ];

        expect(result).toEqual(expected);

        jest.useRealTimers();
    });
});
