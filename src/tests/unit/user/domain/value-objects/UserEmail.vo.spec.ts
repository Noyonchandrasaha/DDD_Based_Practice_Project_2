// ============================================================
// FILE: tests/unit/domain/user/value-objects/UserEmail.vo.spec.ts
// ============================================================

import { UserEmailVO } from '../../../../../modules/user/domain/value-objects/UserEmail.vo';

describe('UserEmailVo',() => {
    // === VALID EMAILS ===
  it('should accept a valid email', () => {
    const email = UserEmailVO.create('noyonsaha@example.com');
    expect(email.email).toBe('noyonsaha@example.com');
  });

  it('should lowercase the email', () => {
    const email = UserEmailVO.create('NoYoN@ExAmPlE.CoM');
    expect(email.email).toBe('noyon@example.com');
  });

  it('should trim whitespace', () => {
    const email = UserEmailVO.create('  noyonsaha@example.com  ');
    expect(email.email).toBe('noyonsaha@example.com');
  });

  it('should handle subdomains', () => {
    const email = UserEmailVO.create('user@mail.example.co.uk');
    expect(email.email).toBe('user@mail.example.co.uk');
  });

  it('should allow numbers and special chars in local part', () => {
    const email = UserEmailVO.create('user+tag123@example.org');
    expect(email.email).toBe('user+tag123@example.org');
  });

  // === INVALID EMAILS ===
  it('should throw if email is empty string', () => {
    expect(() => UserEmailVO.create('')).toThrow('Email cannot be empty');
  });

  it('should throw if email is only whitespace', () => {
    expect(() => UserEmailVO.create('   ')).toThrow('Email cannot be empty');
  });

  it('should throw if email is null or undefined', () => {
    // @ts-ignore - testing runtime
    expect(() => UserEmailVO.create(null)).toThrow('Email cannot be empty');
    // @ts-ignore
    expect(() => UserEmailVO.create(undefined)).toThrow('Email cannot be empty');
  });

  it('should throw for missing @', () => {
    expect(() => UserEmailVO.create('noyongmail.com')).toThrow('Invalid email format');
  });

  it('should throw for missing domain', () => {
    expect(() => UserEmailVO.create('noyon@')).toThrow('Invalid email format');
  });

  it('should throw for missing local part', () => {
    expect(() => UserEmailVO.create('@example.com')).toThrow('Invalid email format');
  });

  it('should throw for missing TLD', () => {
    expect(() => UserEmailVO.create('noyon@example')).toThrow('Invalid email format');
  });

  it('should throw for double @@', () => {
    expect(() => UserEmailVO.create('noyon@@example.com')).toThrow('Invalid email format');
  });

  it('should throw for spaces in email', () => {
    expect(() => UserEmailVO.create('noyon saha@example.com')).toThrow('Invalid email format');
  });

  it('should throw for trailing dot in domain', () => {
    expect(() => UserEmailVO.create('noyon@example.com.')).toThrow('Invalid email format');
  });

  // === ERROR MESSAGES ===
  it('should include email in error message for invalid format', () => {
    expect(() => UserEmailVO.create('bad@@email')).toThrow('Invalid email format: bad@@email');
  });

  // === IMMUTABILITY (Bonus) ===
  it('should not allow mutation of props', () => {
    const email = UserEmailVO.create('test@example.com');
    // @ts-ignore - testing immutability
    expect(() => { email.props.value = 'hack'; }).toThrow();
  });
})