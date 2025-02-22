import isValidEmail from "@/utils/validation/validateEmail";


describe('isValidEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag+sorting@example.com')).toBe(true);
    expect(isValidEmail('user_name@example.co.uk')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(isValidEmail('plainaddress')).toBe(false);
    expect(isValidEmail('@missingusername.com')).toBe(false);
    expect(isValidEmail('username@.com')).toBe(false);
    expect(isValidEmail('username@com')).toBe(false);
    expect(isValidEmail('username@.com.')).toBe(false);
    expect(isValidEmail('username@-example.com')).toBe(false);
  });
});
