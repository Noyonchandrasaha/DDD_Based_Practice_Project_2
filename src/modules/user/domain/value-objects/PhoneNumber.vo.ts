// ============================================================
// FILE: src/modules/user/domain/value-objects/PhoneNumber.vo.ts
// ============================================================

import { ValueObject } from '@core/domain/value-objects/ValueObject';
import { REGEX_PATTERNS } from '@common/constants/regex.constants';

export interface PhoneNumberProps {
    phoneNumber: string;
}

export class PhoneNumberVO extends ValueObject<PhoneNumberProps> {
    private constructor(props: PhoneNumberProps) {
        super(props);
    }

    get phoneNumber(): string {
        return this.props.phoneNumber;
    }

    private static validate(input: string): void {
        if (!input?.trim()) {
            throw new Error('Phone number cannot be empty');
        }

        const trimmed = input.trim();
        const phoneRegex = REGEX_PATTERNS.PHONE;

        if (!phoneRegex.test(trimmed)) {
            throw new Error(`Invalid phone number format: ${trimmed}`);
        }

        // Count only digits (allow leading +)
        const digits = trimmed.replace(/[^\d]/g, '');
        if (digits.length < 7 || digits.length > 15) {
            throw new Error(`Phone number must have 7 to 15 digits: ${trimmed}`);
        }
    }

    public static create(phoneNumber: string): PhoneNumberVO {
        // Validate first
        PhoneNumberVO.validate(phoneNumber);

        // Normalize: remove spaces, dots, dashes
        const normalized = phoneNumber.trim().replace(/[\s.-]/g, '');

        const props: PhoneNumberProps = { phoneNumber: normalized };
        return new PhoneNumberVO(props);
    }
}