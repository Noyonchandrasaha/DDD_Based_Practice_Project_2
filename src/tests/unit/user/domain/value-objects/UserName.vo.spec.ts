// ============================================================
// FILE: tests/unit/domain/user/value-objects/UserName.vo.spec.ts
// ============================================================


import { UserNameVO } from '../../../../../modules/user/domain/value-objects/UserName.vo';

describe('UserNameVo', () => {
  it('should create a valid full name', () => {
    const userName = UserNameVO.create('Saha', 'Noyon'); // lastName, firstName
    expect(userName.fullName()).toBe('Noyon Saha');
  });

  it('should create a valid full name with middle name', () => {
    const userName = UserNameVO.create('Saha', 'Noyon', 'Chandra'); // lastName, firstName, middleName
    expect(userName.fullName()).toBe('Noyon Chandra Saha');
  });

  it('should work with only last name', () => {
    const userName = UserNameVO.create('Saha'); // only lastName
    expect(userName.fullName()).toBe('Saha');
  });

  it('should throw error if last name is empty', () => {
    expect(() => UserNameVO.create('')).toThrow('Last name cannot be empty.');
  });

  it('should throw error for invalid characters in last name', () => {
    expect(() => UserNameVO.create('Saha123')).toThrow('Last name must contain only letters.');
  });
});