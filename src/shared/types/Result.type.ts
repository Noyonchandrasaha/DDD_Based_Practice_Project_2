// ============================================================
// FILE: src/shared/types/Result.type.ts
// ============================================================

export class Result<T, E = string> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly error?: E,
    private readonly _value?: T
  ) {}

  static ok<T, E = string>(value: T): Result<T, E> {
    return new Result<T, E>(true, undefined, value);
  }

  static fail<T, E = string>(error: E): Result<T, E> {
    return new Result<T, E>(false, error);
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value of failed result');
    }
    return this._value!;
  }

  getError(): E {
    return this.error!;
  }

  isFailure(): boolean {
    return !this.isSuccess;
  }
}