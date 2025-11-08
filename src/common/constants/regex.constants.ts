// ============================================================
// FILE: src/common/constants/regex.constants.ts
// ============================================================

export const REGEX_PATTERNS = {
  //Name
  NAME: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/,
  // Email
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+[^.\s]$/,

  // Passwords (Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character)
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // Username (alphanumeric, 3-20 characters, can include underscores)
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,

  // Phone number (international format, optional '+', 7-15 digits)
  PHONE: /^\+?[1-9]\d{0,3}[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/,

  // URL (http, https, ftp)
  URL: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/,

  // IPv4 address
  IPV4: /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,

  // IPv6 address
  IPV6: /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|(([0-9a-fA-F]{1,4}:){1,7}:)|(([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})|(([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2})|(([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3})|(([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4})|(([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5})|([0-9a-fA-F]{1,4}:)((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,

  // Hex color (#FFF or #FFFFFF)
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

  // Date (YYYY-MM-DD)
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,

  // Time (HH:MM, 24-hour)
  TIME_24H: /^([01]\d|2[0-3]):([0-5]\d)$/,

  // UUID v4
  UUID_V4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  // Only numbers
  NUMERIC: /^\d+$/,

  // Only alphabets (upper or lower case)
  ALPHABETIC: /^[A-Za-z]+$/,

  // Alphanumeric
  ALPHANUMERIC: /^[A-Za-z0-9]+$/,

  // No whitespace
  NO_WHITESPACE: /^\S+$/,

  // Strong slug (for URLs, lowercase letters, numbers, hyphens)
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};
