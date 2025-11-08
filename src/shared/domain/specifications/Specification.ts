// ============================================================================
// FILE: src/shared/domain/specifications/Specification.ts
// ============================================================================

export abstract class Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification<T>(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification<T>(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification<T>(this);
  }
}


// AND combinator - INTERNAL USE ONLY
 
class AndSpecification<T> extends Specification<T> {
  constructor(private left: Specification<T>, private right: Specification<T>) {
    super();
  }
  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
  }
}


// OR combinator - INTERNAL USE ONLY

class OrSpecification<T> extends Specification<T> {
  constructor(private left: Specification<T>, private right: Specification<T>) {
    super();
  }
  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
  }
}


// NOT combinator - INTERNAL USE ONLY

class NotSpecification<T> extends Specification<T> {
  constructor(private spec: Specification<T>) {
    super();
  }
  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
}