// ============================================================================
// FILE: src/common/utils/DateHelper.util.ts
// ============================================================================

export class DateHelper {

  public static toISOString(date: Date = new Date()): string {
    return date.toISOString();
  }


  public static toDateString(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  }

  public static toDateTimeString(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    const seconds = (`0${date.getSeconds()}`).slice(-2);
    return `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;
  }

  public static isPast(date: Date): boolean {
    return date.getTime() < Date.now();
  }

  public static isFuture(date: Date): boolean {
    return date.getTime() > Date.now();
  }

  public static diffMs(startDate: Date, endDate: Date): number {
    return endDate.getTime() - startDate.getTime();
  }

  public static diffSeconds(startDate: Date, endDate: Date): number {
    return Math.floor(this.diffMs(startDate, endDate) / 1000);
  }

  public static diffMinutes(startDate: Date, endDate: Date): number {
    return Math.floor(this.diffSeconds(startDate, endDate) / 60);
  }

  public static diffHours(startDate: Date, endDate: Date): number {
    return Math.floor(this.diffMinutes(startDate, endDate) / 60);
  }

  public static diffDays(startDate: Date, endDate: Date): number {
    return Math.floor(this.diffHours(startDate, endDate) / 24);
  }
}
