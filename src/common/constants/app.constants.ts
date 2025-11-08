// ============================================================
// FILE: src/common/constants/app.constants.ts
// ============================================================


//Common file system paths
export const PATHS = {
  UPLOADS: process.env.UPLOAD_PATH || 'uploads/',
  LOGS: process.env.LOG_PATH || 'logs/',
};

 //Default pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

 //Miscellaneous constants
export const MISC = {
  DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TIMEZONE: process.env.TIMEZONE || 'UTC',
};
