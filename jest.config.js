// ============================================================================
// FILE: jest.config.js
// DESCRIPTION: Jest configuration aligned with TypeScript + Express + Prisma project
// ============================================================================

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Base test directories
  roots: ['<rootDir>/src'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts',
    '**/tests/**/*.+(spec|test).ts'
  ],

  // Transform TypeScript files using ts-jest
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Ignore build and config folders
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
  ],

  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/index.ts',
    '!src/server.ts',           // entrypoint usually excluded
    '!src/config/**',           // configuration files are not tested
    '!src/**/*.mock.ts',        // mocks excluded
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Module name aliases (match your tsconfig paths)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },

  // Jest optimizations
  clearMocks: true,
  restoreMocks: true,
  resetMocks: false,
  verbose: true,

  // Global setup/teardown if needed for database or env setup
  // globalSetup: "<rootDir>/tests/setup/globalSetup.ts",
  // globalTeardown: "<rootDir>/tests/setup/globalTeardown.ts",

  // Automatically restore mocks between tests
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
