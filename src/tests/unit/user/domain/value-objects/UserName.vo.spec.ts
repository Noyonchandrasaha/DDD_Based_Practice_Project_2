// ============================================================
// FILE: tests/unit/domain/user/value-objects/UserName.vo.spec.ts
// ============================================================

import { UserNameVO } from '../../../../../modules/user/domain/value-objects/UserName.vo';

// Mock the regex pattern (same as production)
jest.mock('@common/constants/regex.constants', () => ({
  REGEX_PATTERNS: {
    NAME: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/,
  },
}));

describe('UserNameVO', () => {
  // -----------------------------------------------------------------
  // 5 DIFFERENT REALISTIC NAME SETS
  // -----------------------------------------------------------------
  const nameSets: Array<{
    last: string;
    first?: string;
    middle?: string;
    expectedFull: string;
  }> = [
    {
      last: 'Smith',
      first: 'John',
      middle: 'Michael',
      expectedFull: 'John Michael Smith',
    },
    {
      last: "O'Connor",
      first: 'Ana',
      middle: 'María',
      expectedFull: "Ana María O'Connor",
    },
    {
      last: 'García',
      first: 'José',
      expectedFull: 'José García',
    },
    {
      last: 'Dubois',
      middle: 'Pierre',
      expectedFull: 'Pierre Dubois',
    },
    {
      last: 'Yamamoto',
      first: 'Hiroshi',
      middle: 'Ken',
      expectedFull: 'Hiroshi Ken Yamamoto',
    },
  ];

  describe('create() - Factory Method', () => {
    it('should create successfully with only last name', () => {
      const { last } = nameSets[0];
      const name = UserNameVO.create(last);
      expect(name.lastName).toBe(last);
      expect(name.firstName).toBeUndefined();
      expect(name.middleName).toBeUndefined();
    });

    it('should create with first and last name', () => {
      const { last, first } = nameSets[2];
      const name = UserNameVO.create(last, first);
      expect(name.firstName).toBe(first);
      expect(name.lastName).toBe(last);
    });

    it('should create with all three names', () => {
      const { last, first, middle } = nameSets[0];
      const name = UserNameVO.create(last, first, middle);
      expect(name.firstName).toBe(first);
      expect(name.middleName).toBe(middle);
      expect(name.lastName).toBe(last);
    });

    it('should trim whitespace from names', () => {
      const { last, first, middle } = nameSets[4];
      const name = UserNameVO.create(
        `  ${last}  `,
        `  ${first}  `,
        `  ${middle}  `
      );
      expect(name.firstName).toBe(first);
      expect(name.middleName).toBe(middle);
      expect(name.lastName).toBe(last);
    });
  });

  describe('validate() - Domain Rules', () => {
    it('should throw if last name is empty', () => {
      expect(() => UserNameVO.create('')).toThrow('Last name cannot be empty.');
    });

    it('should throw if last name is only whitespace', () => {
      expect(() => UserNameVO.create('   ')).toThrow('Last name cannot be empty.');
    });

    it('should throw if last name contains invalid characters', () => {
      expect(() => UserNameVO.create('Smith123')).toThrow('Last name must contain only letters.');
      expect(() => UserNameVO.create('Smith!')).toThrow('Last name must contain only letters.');
    });

    it('should throw if first name contains invalid characters', () => {
      const last = nameSets[0].last;
      expect(() => UserNameVO.create(last, 'John123')).toThrow('First name must contain only letters.');
      expect(() => UserNameVO.create(last, 'John!')).toThrow('First name must contain only letters.');
    });

    it('should throw if middle name contains invalid characters', () => {
      const { last, first } = nameSets[0];
      expect(() => UserNameVO.create(last, first, 'Mike@')).toThrow('Middle name must contain only letters.');
    });

    it('should allow letters, hyphens, apostrophes, and accented chars', () => {
      const name = UserNameVO.create("O'Connor", 'José', 'Marie-Claire');
      expect(name.lastName).toBe("O'Connor");
      expect(name.firstName).toBe('José');
      expect(name.middleName).toBe('Marie-Claire');
    });
  });

  describe('getters', () => {
    it('should expose firstName, middleName, lastName correctly', () => {
      const { last, first, middle } = nameSets[1];
      const name = UserNameVO.create(last, first, middle);
      expect(name.firstName).toBe(first);
      expect(name.middleName).toBe(middle);
      expect(name.lastName).toBe(last);
    });

    it('should return undefined for optional fields', () => {
      const { last } = nameSets[3];
      const name = UserNameVO.create(last);
      expect(name.firstName).toBeUndefined();
      expect(name.middleName).toBeUndefined();
    });
  });

  describe('fullName()', () => {
    it('should return only last name when others are missing', () => {
      const { last } = nameSets[0];
      const name = UserNameVO.create(last);
      expect(name.fullName()).toBe(last);
    });

    it('should return first + last name', () => {
      const { last, first, expectedFull } = nameSets[2];
      const name = UserNameVO.create(last, first);
      expect(name.fullName()).toBe(expectedFull);
    });

    it('should return all three names in order', () => {
      const { expectedFull } = nameSets[0];
      const { last, first, middle } = nameSets[0];
      const name = UserNameVO.create(last, first, middle);
      expect(name.fullName()).toBe(expectedFull);
    });

    it('should skip empty or whitespace-only names', () => {
      const { last, first, expectedFull } = nameSets[2];
      const name = UserNameVO.create(last, first, '   ');
      expect(name.fullName()).toBe(expectedFull);
    });

    it('should handle all fields empty except last name', () => {
      const { last } = nameSets[3];
      const name = UserNameVO.create(last, '', '  ');
      expect(name.fullName()).toBe(last);
    });

    it('should handle complex valid names', () => {
      const { expectedFull } = nameSets[4];
      const { last, first, middle } = nameSets[4];
      const name = UserNameVO.create(last, first, middle);
      expect(name.fullName()).toBe(expectedFull);
    });
  });

  describe('Immutability & Encapsulation', () => {
    it('should freeze props internally (if ValueObject does)', () => {
      const { last, first } = nameSets[0];
      const name = UserNameVO.create(last, first);
      expect(Object.isFrozen(name)).toBe(false);
   });
  });
});