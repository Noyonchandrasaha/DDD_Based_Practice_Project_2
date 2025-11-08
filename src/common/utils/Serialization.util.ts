// ============================================================================
// FILE: src/common/utils/Serialization.util.ts
// ============================================================================

export class SerializationHelper {
  public static safeStringify(obj: any, replacer?: (key: string, value: any) => any, space?: number): string {
    try {
      return JSON.stringify(obj, replacer, space);
    } catch (err) {
      console.error('SerializationHelper.safeStringify error:', err);
      return '';
    }
  }

  public static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
  }
  public static sanitize<T extends Record<string, any>>(obj: T, sensitiveFields: string[] = []): Partial<T> {
    const cloned = this.deepClone(obj);

    for (const field of sensitiveFields) {
      if (cloned.hasOwnProperty(field)) {
        delete cloned[field];
      }
    }

    return cloned;
  }

  public static normalize<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
  }
}
