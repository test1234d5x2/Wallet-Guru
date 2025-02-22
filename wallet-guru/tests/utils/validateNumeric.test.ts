import isNumeric from '@/utils/validation/validateNumeric';

describe('isNumeric', () => {
  it('should return true for valid numeric strings', () => {
    expect(isNumeric('123')).toBe(true);
    expect(isNumeric('-123')).toBe(true);
    expect(isNumeric('123.456')).toBe(true);
    expect(isNumeric('-123.456')).toBe(true);
  });

  it('should return false for invalid numeric strings', () => {
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric('123a')).toBe(false);
    expect(isNumeric('12.3.4')).toBe(false);
    expect(isNumeric('')).toBe(false);
    expect(isNumeric(' ')).toBe(false);
  });
});
