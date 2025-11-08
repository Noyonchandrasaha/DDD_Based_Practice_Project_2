// ============================================================
// FILE: src/modules/user/domain/value-objects/PhoneNumber.vo.ts
// ============================================================

import { ValueObject } from '../../../../core/domain/value-objects/ValueObject';
import { REGEX_PATTERNS } from '../../../../common/constants/regex.constants';

export interface PhoneNumberProps {
  value: string;
}

export class PhoneNumberVO extends ValueObject<PhoneNumberProps> {
  private constructor(props: PhoneNumberProps) {
    super(props);
  }

  get phoneNumber(): string {
    return this.props.value;
  }

  private static validate(phoneNumber: string): void {
    if (phoneNumber == null || phoneNumber.trim() === '') {
      throw new Error('Phone number cannot be empty');
    }

    const trimmed = phoneNumber.trim();
    const phoneRegex = REGEX_PATTERNS.PHONE;

    if (!phoneRegex.test(trimmed)) {
      throw new Error(`Invalid phone numbe format: ${trimmed}`);
    }

    // Count digits only
    const digits = trimmed.replace(/[^\d]/g, '');
    if (digits.length < 7 || digits.length > 15) {
      throw new Error(`Invalid phone numbe format: ${trimmed}`);
    }
  }

  public static create(phoneNumber: string): PhoneNumberVO {
    PhoneNumberVO.validate(phoneNumber);
    const clean = phoneNumber.trim().replace(/[\s.-]/g, ''); // ← CORRECT
    return new PhoneNumberVO({ value: clean });
    }
}