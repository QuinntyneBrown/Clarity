import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/projects'],
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '@api': '<rootDir>/projects/api/src/public-api',
    '@components': '<rootDir>/projects/components/src/public-api',
  },
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': ['jest-preset-angular', {
      tsconfig: 'tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    }],
  },
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|@angular|rxjs|@ngrx))'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],
  testMatch: ['**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};

export default config;
