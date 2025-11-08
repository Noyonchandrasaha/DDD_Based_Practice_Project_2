// ============================================================
// FILE: tests/unit/domain/user/value-objects/PhoneNumber.vo.spec.ts
// ============================================================

import { PhoneNumberVO } from '../../../../../modules/user/domain/value-objects/PhoneNumber.vo';

describe('PhoneNumberVO', () => {
  // =================================================================
  // Valid Inputs: Test normalization (trim + remove spaces, dots, dashes, parentheses)
  // =================================================================
  const validPhoneInputs = [
    { input: '  +1 555-123-4567  ', expected: '+15551234567' },
    { input: '555.123.4567', expected: '5551234567' },
    { input: '(555) 123 4567', expected: '5551234567' },
    { input: '  555  123  4567  ', expected: '5551234567' },
    { input: '+44 20 7946 0958', expected: '+442079460958' },
    { input: '1234567', expected: '1234567' },
    { input: '123456789012345', expected: '123456789012345' },
  ];

  // =================================================================
  // Invalid Inputs: Empty
  // =================================================================
  const emptyInputs = ['', '   ', null, undefined];

  // =================================================================
  // Invalid Inputs: Format (non-digit characters or bad structure)
  // =================================================================
  const invalidFormatInputs = [
    'abc123',
    '+123-abc-456',
    '555-123-abc',
    '++15551234567',
    '555-123-4567!',
    '123.456.7890.1234', // too many separators
  ];

  // =================================================================
  // Invalid Inputs: Pure digits, wrong length (fail on regex)
  // =================================================================
  const invalidDigitCountInputs = [
    '123456',           // 6 digits
    '1',                // 1 digit
    '1234567890123456', // 16 digits
    '12345678901234567',// 17 digits
  ];

  // =================================================================
  // create() - Factory Method
  // =================================================================
  describe('create() - Factory Method', () => {
    it('should create successfully with valid phone number', () => {
      const vo = PhoneNumberVO.create('5551234567');
      expect(vo.phoneNumber).toBe('5551234567');
    });

    it('should trim and remove spaces, dots, dashes, parentheses', () => {
      validPhoneInputs.forEach(({ input, expected }) => {
        const vo = PhoneNumberVO.create(input);
        expect(vo.phoneNumber).toBe(expected);
      });
    });

    it('should return different instances for different numbers', () => {
      const phone1 = PhoneNumberVO.create('5551234567');
      const phone2 = PhoneNumberVO.create('5551234568');
      expect(phone1).not.toBe(phone2);
    });
  });

  // =================================================================
  // validate() - Domain Rules
  // =================================================================
  describe('validate() - Domain Rules', () => {
    it('should throw "Phone number cannot be empty" for empty or whitespace', () => {
      emptyInputs.forEach(input => {
        // @ts-ignore
        expect(() => PhoneNumberVO.create(input)).toThrow('Phone number cannot be empty');
      });
    });

    it('should throw "Invalid phone number format" for malformed formats', () => {
      invalidFormatInputs.forEach(input => {
        expect(() => PhoneNumberVO.create(input)).toThrow(/^Invalid phone number format:/);
      });
    });

    it('should throw "Invalid phone number format" for digit count < 7 or > 15 (fails regex first)', () => {
      invalidDigitCountInputs.forEach(input => {
        expect(() => PhoneNumberVO.create(input)).toThrow(/^Invalid phone number format:/);
      });
    });

    it('should include the invalid input in the error message', () => {
      const bad = 'abc123';
      expect(() => PhoneNumberVO.create(bad)).toThrow(`Invalid phone number format: ${bad}`);
    });

    it('should allow valid formats with special characters', () => {
      const specials = [
        '+1 555-123-4567',
        '(555) 123 4567',
        '555.123.4567',
        '+44 20 7946 0958',
      ];
      specials.forEach(phone => {
        expect(() => PhoneNumberVO.create(phone)).not.toThrow();
      });
    });
  });

  // =================================================================
  // getter
  // =================================================================
  describe('getter', () => {
    it('should expose the normalized phone number via .phoneNumber', () => {
      const input = '  +1 555-123-4567  ';
      const vo = PhoneNumberVO.create(input);
      expect(vo.phoneNumber).toBe('+15551234567');
    });

    it('should return a string', () => {
      const vo = PhoneNumberVO.create('5551234567');
      expect(typeof vo.phoneNumber).toBe('string');
    });
  });

  // =================================================================
  // edge cases
  // =================================================================
  describe('edge cases', () => {
    it('should accept minimum 7 digits', () => {
      expect(() => PhoneNumberVO.create('1234567')).not.toThrow();
    });

    it('should accept maximum 15 digits', () => {
      expect(() => PhoneNumberVO.create('123456789012345')).not.toThrow();
    });

    it('should reject 6 digits', () => {
      expect(() => PhoneNumberVO.create('123456')).toThrow('Invalid phone number format');
    });

    it('should reject 16 digits', () => {
      expect(() => PhoneNumberVO.create('1234567890123456')).toThrow('Invalid phone number format');
    });

    it('should allow leading +', () => {
      const vo = PhoneNumberVO.create('+15551234567');
      expect(vo.phoneNumber).toBe('+15551234567');
    });

    it('should reject multiple + signs', () => {
      expect(() => PhoneNumberVO.create('++15551234567')).toThrow('Invalid phone number format');
    });
  });

  // =================================================================
  // immutability
  // =================================================================
  describe('immutability', () => {
    it('should prevent mutation of phone number after creation', () => {
      const vo = PhoneNumberVO.create('5551234567');
      const original = vo.phoneNumber;

      // This throws TypeError — which proves immutability
      expect(() => {
        (vo as any).props.phoneNumber = '9999999999';
      }).toThrow(TypeError);

      expect(vo.phoneNumber).toBe(original);
    });
  });
});