// ============================================================
// FILE: src/common/constants/error-messages.constants.ts
// ============================================================

export const ERROR_MESSAGES = {
  // Generic
  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access to this resource is forbidden.',
  BAD_REQUEST: 'Invalid request parameters.',
  TIMEOUT: "Timeout exceeded",

  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Authentication token has expired.',
  TOKEN_INVALID: 'Authentication token is invalid.',
  USER_NOT_FOUND: 'User not found.',
  USER_ALREADY_EXISTS: 'User already exists.',
  AUTHENTICATION_FAILED: "Authentication failed",

  // Validation
  VALIDATION_FAILED: 'Validation failed for the input data.',
  MISSING_REQUIRED_FIELDS: 'Required fields are missing.',

  // Database
  RECORD_NOT_FOUND: 'Record not found in the database.',
  DUPLICATE_RECORD: 'Duplicate record exists in the database.',
  DATABASE_CONNECTION_ERROR: 'Failed to connect to the database.',

  // Files / Uploads
  FILE_NOT_FOUND: 'File not found.',
  FILE_UPLOAD_FAILED: 'Failed to upload the file.',
  FILE_TYPE_NOT_ALLOWED: 'This file type is not allowed.',
  FILE_TOO_LARGE: 'Uploaded file exceeds the allowed size.',

  // External services / API
  EXTERNAL_API_ERROR: 'An error occurred while calling an external service.',
  SERVICE_UNAVAILABLE: 'External service is unavailable.',

  // Rate limiting
  TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
  API_RATE_LIMIT: 'API rate limit exceeded.',
  SIGNUP_LOGIN_RATE_LIMIT : 'Too many login/signup attempts, please try again later.',
  SENSITIVE_API_RATE_LIMIT: 'Too many requests to this endpoint. Slow down!',


  // Custom domain errors (example)
  ENTITY_NOT_ACTIVE: 'The requested entity is not active.',
  OPERATION_NOT_ALLOWED: 'This operation is not allowed.',
};
