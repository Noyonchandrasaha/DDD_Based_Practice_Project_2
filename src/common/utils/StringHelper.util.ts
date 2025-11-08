// ============================================================================
// FILE: src/common/utils/StringHelper.util.ts
// ============================================================================

export class StringHelper {

  public static capitalize(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  public static toCamelCase(value: string): string {
    if (!value) return '';
    return value
      .replace(/[-_ ]+./g, (match) => match.charAt(match.length - 1).toUpperCase())
      .replace(/^[A-Z]/, (match) => match.toLowerCase());
  }

  public static toSnakeCase(value: string): string {
    if (!value) return '';
    return value
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/^_/, '');
  }

  public static toKebabCase(value: string): string {
    if (!value) return '';
    return value
      .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
      .replace(/^-/, '');
  }

  public static isEmpty(value: string | null | undefined): boolean {
    return !value || value.trim().length === 0;
  }

  public static truncate(value: string, length: number, ellipsis: boolean = true): string {
    if (!value) return '';
    if (value.length <= length) return value;
    return value.slice(0, length) + (ellipsis ? '...' : '');
  }

  public static randomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public static replaceAll(value: string, search: string | RegExp, replacement: string): string {
    if (!value) return '';
    return value.replace(new RegExp(search, 'g'), replacement);
  }

  public static slugify(value: string, separator: string = '-'): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .normalize('NFD') 
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^a-z0-9]+/g, separator) 
      .replace(new RegExp(`${separator}+`, 'g'), separator) 
      .replace(new RegExp(`^${separator}|${separator}$`, 'g'), ''); 
  }
}
