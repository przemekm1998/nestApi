import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePaths: ['.'],
  rootDir: 'src',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts', '<rootDir>/**/*.e2e-spec.ts'],
  maxWorkers: 1,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};

export default config;
