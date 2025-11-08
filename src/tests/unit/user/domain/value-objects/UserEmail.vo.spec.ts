// ============================================================
// FILE: tests/unit/domain/user/value-objects/UserEmail.vo.spec.ts
// ============================================================

import { UserEmailVO } from '../../../../../modules/user/domain/value-objects/UserEmail.vo';



describe('UserEmailVO', () => {
  // -----------------------------------------------------------------
  // Valid Emails: Test normalization (trim + lowercase)
  // -----------------------------------------------------------------
  const validEmailInputs = [
    { input: '  JOHN.DOE@EXAMPLE.COM  ', expected: 'john.doe@example.com' },
    { input: 'Ana+Tag@Gmail.Co.Uk', expected: 'ana+tag@gmail.co.uk' },
    { input: 'test.user@sub.domain.org ', expected: 'test.user@sub.domain.org' },
    { input: 'Jose@Domain.Co', expected: 'jose@domain.co' },
    { input: 'simple@ex.com', expected: 'simple@ex.com' },
  ];

  // -----------------------------------------------------------------
  // Invalid Emails: Split into "empty" and "format" errors
  // -----------------------------------------------------------------
  const emptyEmails = ['', '   '];

  const invalidFormatEmails = [
    'not-an-email',
    'user@',
    '@domain.com',
    'user@domain',
    'user@domain.c',
    'user.name@domain..com',
    'user@.com',
    'user@domain_com',
    'user@domain.',
    'user@domain..com',
    ];

  // -----------------------------------------------------------------
  // Special valid emails (allowed characters)
  // -----------------------------------------------------------------
  const specialValidEmails = [
    'user+tag@domain.com',
    'user.name@sub.domain.co.uk',
    'user%20name@domain.org',
    'user@192-168-1-1.example.com',
    'admin@localhost.local',
  ];

  // =================================================================
  // create() - Factory Method
  // =================================================================
  describe('create() - Factory Method', () => {
    it('should create successfully with valid email', () => {
      const vo = UserEmailVO.create('john.doe@example.com');
      expect(vo.email).toBe('john.doe@example.com');
    });

    it('should trim and lowercase the email', () => {
      validEmailInputs.forEach(({ input, expected }) => {
        const vo = UserEmailVO.create(input);
        expect(vo.email).toBe(expected);
      });
    });

    it('should return different instances for different emails', () => {
      const email1 = UserEmailVO.create('a@example.com');
      const email2 = UserEmailVO.create('b@example.com');
      expect(email1).not.toBe(email2);
    });
  });

  // =================================================================
  // validate() - Domain Rules
  // =================================================================
  describe('validate() - Domain Rules', () => {
    it('should throw "Email cannot be empty." for empty or whitespace', () => {
      emptyEmails.forEach(email => {
        expect(() => UserEmailVO.create(email)).toThrow('Email cannot be empty.');
      });
    });

    it('should throw "Invalid email format: ..." for malformed emails', () => {
      invalidFormatEmails.forEach(email => {
        expect(() => UserEmailVO.create(email)).toThrow(/^Invalid email format:/);
      });
    });

    it('should include the invalid email in the error message', () => {
      const bad = 'bad@format';
      expect(() => UserEmailVO.create(bad)).toThrow(`Invalid email format: ${bad}`);
    });

    it('should allow valid emails with special characters', () => {
      specialValidEmails.forEach(email => {
        expect(() => UserEmailVO.create(email)).not.toThrow();
      });
    });
  });

  // =================================================================
  // getter
  // =================================================================
  describe('getter', () => {
    it('should expose the normalized email via .email', () => {
      const input = '  TEST@EXAMPLE.ORG  ';
      const vo = UserEmailVO.create(input);
      expect(vo.email).toBe('test@example.org');
    });

    it('should return a string', () => {
      const vo = UserEmailVO.create('user@domain.com');
      expect(typeof vo.email).toBe('string');
    });
  });

  // =================================================================
  // edge cases
  // =================================================================
  describe('edge cases', () => {
    it('should accept maximum local part length (64 chars)', () => {
      const maxLocal = 'a'.repeat(64) + '@domain.com';
      expect(() => UserEmailVO.create(maxLocal)).not.toThrow();
    });

    it('should reject local part longer than 64 chars', () => {
      const tooLong = 'a'.repeat(65) + '@domain.com';
      expect(() => UserEmailVO.create(tooLong)).toThrow(/^Invalid email format:/);
    });

    it('should reject double dots in domain', () => {
      expect(() => UserEmailVO.create('user@domain..com'))
        .toThrow('Invalid email format: user@domain..com');
    });

    it('should reject international characters in local part', () => {
      expect(() => UserEmailVO.create('josé@domain.co'))
        .toThrow('Invalid email format: josé@domain.co');
    });
  });

  // =================================================================
  // immutability
  // =================================================================
  describe('immutability', () => {
    it('should prevent mutation of email after creation', () => {
      const vo = UserEmailVO.create('user@domain.com');
      const original = vo.email;

      // Try to mutate via value
      (vo as any).value.email = 'hacked@evil.com';

      expect(vo.email).toBe(original); // Still original
    });
  });
});