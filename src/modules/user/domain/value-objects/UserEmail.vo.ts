// ============================================================
// FILE: src/modules/user/domain/value-objects/Email.vo.ts
// ============================================================

import { ValueObject } from '../../../../core/domain/value-objects/ValueObject';
import { REGEX_PATTERNS } from '../../../../common/constants/regex.constants';

export interface EmailProps {
    value: string;
}

export class UserEmailVO extends ValueObject<EmailProps> {
    private constructor(props: EmailProps) {
        super(props);
    }

    get email(): string {
        return this.props.value;
    }

    private static validate(email: string): void {
        if(email==null || email.trim() === ''){
            throw new Error(`Email cannot be empty`);
        }
        const trimedEmail = email.trim();
        const emailRegex = REGEX_PATTERNS.EMAIL;
        if(!emailRegex.test(trimedEmail)){
            throw new Error(`Invalid email format: ${trimedEmail}`);
        }
    }

    public static create(email: string): UserEmailVO {
        UserEmailVO.validate(email);
        return new UserEmailVO({value: email.toLowerCase().trim()})
    }
}