// ============================================================
// FILE: src/modules/user/domain/specifications/UserEmailUniqueSpec.ts
// ============================================================

import { User } from '../User.entity';
import { UserEmailVO } from '../value-objects/UserEmail.vo';

export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): Promise<boolean>;
}

export interface IUserEmailLookup {
  findByEmail(email: string): Promise<User | null>;
}

export class EmailNotUniqueError extends Error {
  public readonly code = 'EMAIL_NOT_UNIQUE' as const;
  constructor(public readonly email: string) {
    super(`The email '${email}' is already in use.`);
    this.name = 'EmailNotUniqueError';
  }
}


function extractEmail(candidate: UserEmailVO | string): string {
  if (typeof candidate === 'string') return candidate.trim();
  return candidate.email.trim();
}

export class UserEmailUniqueSpecification
  implements ISpecification<UserEmailVO | string>
{
  constructor(
    private readonly lookup: IUserEmailLookup,
    private readonly options?: { excludeUserId?: string }
  ) {}

  async isSatisfiedBy(candidate: UserEmailVO | string): Promise<boolean> {
    const email = extractEmail(candidate);

    // Lookup any user holding this email
    const found = await this.lookup.findByEmail(email);
    if (!found) return true;

    // Allow same user to reuse their own email during updates
    if (this.options?.excludeUserId && found.id === this.options.excludeUserId) {
      return true;
    }

    return false;
  }


  async assert(candidate: UserEmailVO | string): Promise<void> {
    const ok = await this.isSatisfiedBy(candidate);
    if (!ok) {
      throw new EmailNotUniqueError(extractEmail(candidate));
    }
  }
}


export function makeUserEmailUniqueSpec(
  lookup: IUserEmailLookup,
  excludeUserId?: string
): UserEmailUniqueSpecification {
  return new UserEmailUniqueSpecification(lookup, { excludeUserId });
}

