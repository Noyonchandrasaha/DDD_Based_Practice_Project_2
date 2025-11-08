// ============================================================
// FILE: src/modules/user/domain/value-objects/Email.vo.ts
// ============================================================

import { ValueObject } from '@core/domain/value-objects/ValueObject';
import { REGEX_PATTERNS } from '@common/constants/regex.constants';

export interface UserEmailProps {
    email: string;
}

export class UserEmailVO extends ValueObject<UserEmailProps> {
    private constructor(props: UserEmailProps) {
        super(props)
    }

    get email(): string{
        return this.props.email
    }

    private static validate(props: UserEmailProps): void {
        if (!props.email?.trim()) {
        throw new Error('Email cannot be empty.');
        }

        const emailRegex = REGEX_PATTERNS.EMAIL;
        if (!emailRegex.test(props.email)) {
        throw new Error(`Invalid email format: ${props.email}`);
        }
    }

    public static create(email: string): UserEmailVO {
        const normalizedEmail = email.trim().toLowerCase();

        const props: UserEmailProps = { email: normalizedEmail };
        UserEmailVO.validate(props);

        return new UserEmailVO(props);
    }
}