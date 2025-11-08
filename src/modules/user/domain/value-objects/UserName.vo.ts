// ============================================================
// FILE: src/modules/user/domain/value-objects/UserName.vo.ts
// ============================================================

import { ValueObject } from '@core/domain/value-objects/ValueObject';
import { REGEX_PATTERNS } from '@common/constants/regex.constants';

export interface UserNameProps {
  lastName: string;
  firstName?: string;
  middleName?: string;
}

export class UserNameVO extends ValueObject<UserNameProps> {
  private constructor (props: UserNameProps) {
    super(props);
  }

  private static validate(props: UserNameProps): void {
    if(!props.lastName?.trim()) {
      throw new Error(`Last name cannot be empty.`);
    }
    const nameRegex = REGEX_PATTERNS.NAME;

    if(props.firstName && !nameRegex.test(props.firstName)){
      throw new Error(`First name must contain only letters.`);
    }

    if(props.middleName && !nameRegex.test(props.middleName)){
      throw new Error(`Middle name must contain only letters.`);
    }
    if(!nameRegex.test(props.lastName)){
      throw new Error(`Last name must contain only letters.`);
    }
  }

  get firstName(): string | undefined {
    return this.props.firstName;
  }

  get middleName(): string | undefined {
    return this.props.middleName
  }

  get lastName(): string | undefined {
    return this.props.lastName
  }

  public static create(lastName: string, firstName?: string, middleName?: string ): UserNameVO {
    const props ={
      lastName: lastName.trim(),
      firstName: firstName?.trim(),
      middleName: middleName?.trim()
    }
    UserNameVO.validate(props);
    return new UserNameVO(props)
  }

  public fullName(): string {
    const names = [this.firstName, this.middleName, this.lastName].filter(name => name &&name.trim() !== '');
    return names.join(' ');
  }
}