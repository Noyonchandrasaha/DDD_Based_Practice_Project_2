// ============================================================
// FILE: src/modules/user/domain/value-objects/UserName.vo.ts
// ============================================================

import { ValueObject } from '../../../../core/domain/value-objects/ValueObject';
import { REGEX_PATTERNS } from '../../../../common/constants/regex.constants';

export interface UserNameProps {
  lastName: string;
  firstName?: string;
  middleName?: string;
}

export class UserNameVO extends ValueObject<UserNameProps> {
  private constructor(props: UserNameProps) {
    super(props);
  }

  // Parameter order: lastName (required), firstName (optional), middleName (optional)
  static create(lastName: string, firstName?: string, middleName?: string): UserNameVO {
    UserNameVO.validate({ lastName, firstName, middleName });
    return new UserNameVO({ lastName, firstName, middleName });
  }

  get firstName(): string | undefined {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get middleName(): string | undefined {
    return this.props.middleName;
  }

  public fullName(): string {
    const names = [this.firstName, this.middleName, this.lastName]
      .filter(name => name && name.trim() !== '');
    
    return names.join(' ');
  }

  private static validate(props: UserNameProps): void {
    // Only lastName is required
    if (!props.lastName?.trim()) {
      throw new Error(`Last name cannot be empty.`);
    }

    const nameRegex = REGEX_PATTERNS.NAME;
    
    // Validate firstName pattern if provided
    if (props.firstName && !nameRegex.test(props.firstName)) {
      throw new Error(`First name must contain only letters.`);
    }
    
    // Validate lastName pattern  
    if (!nameRegex.test(props.lastName)) {
      throw new Error(`Last name must contain only letters.`);
    }
    
    // Validate middleName pattern if present
    if (props.middleName && !nameRegex.test(props.middleName)) {
      throw new Error(`Middle name must contain only letters.`);
    }
  }
}