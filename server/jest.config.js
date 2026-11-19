module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  // Unit tests only: e2e suites run via jest-e2e.config.js, setup.ts is not a test
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '\\.e2e\\.ts$', '/e2e/', '/__tests__/setup\\.ts$'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};

