// ============================================================================
// FILE: src/core/types/Option.type.ts
// ============================================================================

export type Option<T> = Some<T> | None;

export class Some<T> {
    readonly isSome: true = true;
    readonly isNone: false = false;
    constructor(public readonly value: T) {}

    map<U>(fn: (value: T) => U): Option<U> {
        return new Some(fn(this.value));
    }

    getOrElse(defaultValue: T): T {
        return this.value ?? defaultValue;
    }
}

export class None {
    readonly isSome: false = false;
    readonly isNone: true = true;

    map<U>(_fn: (value: any) => U): Option<U> {
        return this;
    }

    getOrElse<U>(defaultValue: U): U {
        return defaultValue;
    }
}

export const Option = {
    some: <T>(value: T): Option<T> => new Some(value),
    none: (): Option<never> => new None(),
    fromNullable: <T>(value: T | null | undefined): Option<T> =>
        value === null || value === undefined ? new None() : new Some(value),
};
