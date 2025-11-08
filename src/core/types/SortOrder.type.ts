// ============================================================================
// FILE: src/core/types/SortOrder.type.ts
// ============================================================================

export type SortOrder = 'asc' | 'desc';

export const validateSortOrder = (value?: string): SortOrder =>
  value === 'asc' || value === 'desc' ? value : 'asc';