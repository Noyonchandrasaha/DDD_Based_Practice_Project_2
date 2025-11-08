// ============================================================
// FILE: src/shared/domain/factories/EntityFactory.ts
// ============================================================

import { BaseEntity } from '../../../core/domain/entities/Entity';

export abstract class EntityFactory<T extends BaseEntity> {
  
  abstract create(props: Partial<T>): T;
}
