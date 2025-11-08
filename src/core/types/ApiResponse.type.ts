// ============================================================================
// FILE: src/core/types/ApiResponse.type.ts
// ============================================================================

export interface StructuredError {
  code?: string | number;            
  fields?: Record<string, string>;   
  stack?: string;                    
}

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse<E = StructuredError> {
  success: false;
  message: string;
  error: E;
  timestamp: string;
}

export type ApiResponse<T = any, E = StructuredError> = SuccessResponse<T> | ErrorResponse<E>;