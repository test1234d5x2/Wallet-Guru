import validateEmpty from "@/utils/validation/validateEmpty";

describe('validateEmpty', () => {
  it('should return true for empty strings', () => {
    expect(validateEmpty('')).toBe(true);
    expect(validateEmpty('   ')).toBe(true);
    expect(validateEmpty('\n\t')).toBe(true);
  });

  it('should return false for non-empty strings', () => {
    expect(validateEmpty('a')).toBe(false);
    expect(validateEmpty(' a ')).toBe(false);
    expect(validateEmpty('hello')).toBe(false);
  });
});
