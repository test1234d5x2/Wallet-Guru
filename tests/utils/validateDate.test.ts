import { isTodayOrBefore, isTodayOrAfter, isValidDate } from '@/utils/validateDate';

describe('validateDate', () => {
  it('should correctly validate if a date is today or before today', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    expect(isTodayOrBefore(yesterday)).toBe(true);
    expect(isTodayOrBefore(today)).toBe(true);
    expect(isTodayOrBefore(tomorrow)).toBe(false);
  });

  it('should correctly validate if a date is today or after today', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    expect(isTodayOrAfter(yesterday)).toBe(false);
    expect(isTodayOrAfter(today)).toBe(true);
    expect(isTodayOrAfter(tomorrow)).toBe(true);
  });

  it('should validate valid dates correctly', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date('2023-01-01'))).toBe(true);
  });

  it('should invalidate invalid dates', () => {
    expect(isValidDate(new Date('invalid-date'))).toBe(false);
    expect(isValidDate(new Date(''))).toBe(false);
  });
});
