// ============================================================
// FILE: src/core/domain/entities/Entity.ts
// ============================================================

export abstract class BaseEntity {
  public readonly id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public deletedAt?: Date | null = null;

  constructor(id?: string) {
    if (id) {
      (this as any).id = id;
      (this as any).createdAt = new Date();
      (this as any).updatedAt = new Date();
    }
  }

  softDelete(): void {
    this.deletedAt = new Date();
  }

  isDeleted(): boolean {
    return this.deletedAt != null;
  }
}