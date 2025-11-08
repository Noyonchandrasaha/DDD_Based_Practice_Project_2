// ============================================================================
// FILE: src/common/utils/Validation.util.ts
// ============================================================================

import { REGEX_PATTERNS } from '../constants/regex.constants';


export class ValidationHelper {
  public static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  public static isEmptyString(value: string | null | undefined): boolean {
    return !value || value.trim().length === 0;
  }

  public static isEmail(value: string): boolean {
    return REGEX_PATTERNS.EMAIL.test(value);
  }

  public static isURL(value: string): boolean {
    return REGEX_PATTERNS.URL.test(value);
  }

  public static isNumeric(value: string | number): boolean {
    return REGEX_PATTERNS.NUMERIC.test(String(value));
  }

  public static isAlpha(value: string): boolean {
    return REGEX_PATTERNS.ALPHABETIC.test(value);
  }

  public static isAlphanumeric(value: string): boolean {
    return REGEX_PATTERNS.ALPHANUMERIC.test(value);
  }

  public static isStrongPassword(value: string): boolean {
    return REGEX_PATTERNS.PASSWORD_STRONG.test(value);
  }

  public static minLength(value: string, min: number): boolean {
    return value.length >= min;
  }

  public static maxLength(value: string, max: number): boolean {
    return value.length <= max;
  }

  public static matchesRegex(value: string, regex: RegExp): boolean {
    return regex.test(value);
  }

  public static isPhone(value: string): boolean {
    return REGEX_PATTERNS.PHONE.test(value);
  }

  public static isUUIDv4(value: string): boolean {
    return REGEX_PATTERNS.UUID_V4.test(value);
  }

  public static isISODate(value: string): boolean {
    return REGEX_PATTERNS.DATE_ISO.test(value);
  }

  public static isTime24H(value: string): boolean {
    return REGEX_PATTERNS.TIME_24H.test(value);
  }

  public static isHexColor(value: string): boolean {
    return REGEX_PATTERNS.HEX_COLOR.test(value);
  }

  public static isSlug(value: string): boolean {
    return REGEX_PATTERNS.SLUG.test(value);
  }
}
