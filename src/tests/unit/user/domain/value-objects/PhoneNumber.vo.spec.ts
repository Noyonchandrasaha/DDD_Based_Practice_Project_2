// ============================================================
// FILE: tests/unit/domain/user/value-objects/PhoneNumber.vo.spec.ts
// ============================================================

import { PhoneNumberVO } from '../../../../../modules/user/domain/value-objects/PhoneNumber.vo';

describe('PhoneNumberVO', () => {
  // === VALID INTERNATIONAL NUMBERS ===
  it('should accept valid international number with + and spaces', () => {
    const phone = PhoneNumberVO.create('+1 555 123 4567');
    expect(phone.phoneNumber).toBe('+15551234567');
  });

  it('should accept + with hyphens', () => {
    const phone = PhoneNumberVO.create('+44-20-1234-5678');
    expect(phone.phoneNumber).toBe('+442012345678');
  });

  it('should trim whitespace', () => {
    const phone = PhoneNumberVO.create('  +91 98765 43210  ');
    expect(phone.phoneNumber).toBe('+919876543210');
  });

  it('should allow no + if country code starts with 1-9', () => {
    const phone = PhoneNumberVO.create('12025550123'); // US
    expect(phone.phoneNumber).toBe('12025550123');
  });

  it('should accept compact format', () => {
    const phone = PhoneNumberVO.create('+12025550123');
    expect(phone.phoneNumber).toBe('+12025550123');
  });

  // === NORMALIZATION (Optional: Remove formatting) ===
  // If you want to store clean digits only, change create() to:
  // return new PhoneNumberVO({ value: phoneNumber.replace(/[\s.-]/g, '') });

  // === INVALID CASES ===
  it('should throw if phone is empty', () => {
    expect(() => PhoneNumberVO.create('')).toThrow('Phone number cannot be empty');
  });

  it('should throw if phone is only whitespace', () => {
    expect(() => PhoneNumberVO.create('   ')).toThrow('Phone number cannot be empty');
  });

  it('should throw if phone is null or undefined', () => {
    // @ts-ignore
    expect(() => PhoneNumberVO.create(null)).toThrow('Phone number cannot be empty');
    // @ts-ignore
    expect(() => PhoneNumberVO.create(undefined)).toThrow('Phone number cannot be empty');
  });

  it('should throw if missing country code (starts with 0)', () => {
    expect(() => PhoneNumberVO.create('0123456789')).toThrow('Invalid phone numbe format');
  });

  it('should throw if country code is 0', () => {
    expect(() => PhoneNumberVO.create('+0123456789')).toThrow('Invalid phone numbe format');
  });

  it('should throw if too short (<7 digits)', () => {
    expect(() => PhoneNumberVO.create('+123456')).toThrow('Invalid phone numbe format');
  });

  it('should throw if too long (>15 digits)', () => {
    expect(() => PhoneNumberVO.create('+1234567890123456')).toThrow('Invalid phone numbe format');
  });

  it('should throw if contains letters', () => {
    expect(() => PhoneNumberVO.create('+1 555 ABC 1234')).toThrow('Invalid phone numbe format');
  });

  it('should throw if double +', () => {
    expect(() => PhoneNumberVO.create('++12025550123')).toThrow('Invalid phone numbe format');
  });

  it('should throw if invalid separators', () => {
    expect(() => PhoneNumberVO.create('+1/555/123/4567')).toThrow('Invalid phone numbe format');
  });

  it('should throw if starts with + but no digits', () => {
    expect(() => PhoneNumberVO.create('+')).toThrow('Invalid phone numbe format');
  });

  it('should throw if ends with separator', () => {
    expect(() => PhoneNumberVO.create('+1 555 123 4567-')).toThrow('Invalid phone numbe format');
  });

  // === ERROR MESSAGES ===
  it('should include trimmed phone in invalid format error', () => {
    expect(() => PhoneNumberVO.create('  +1 abc  ')).toThrow('Invalid phone numbe format: +1 abc');
  });

  // === IMMUTABILITY ===
  it('should not allow mutation of props', () => {
    const phone = PhoneNumberVO.create('+15551234567');
    // @ts-ignore
    expect(() => { phone.props.value = 'hack'; }).toThrow(TypeError);
  });
});