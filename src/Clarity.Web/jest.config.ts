import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/projects'],
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '@api': '<rootDir>/projects/api/src/public-api',
    '@components': '<rootDir>/projects/components/src/public-api',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      stringifyContentPathRegex: '\\.html$',
    }],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/*.spec.ts'],
};

export default config;
