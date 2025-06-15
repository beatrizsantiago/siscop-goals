import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: [
    "\\\\node_modules\\\\"
  ],
  coverageProvider: "babel",
  coverageReporters: ["html"],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/tests/__mocks__/emptyMock.js",
    "\\.(svg|jpg|jpeg|png|webp)$": "<rootDir>/tests/__mocks__/emptyMock.js",
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@fb/(.*)$': '<rootDir>/src/firebase/$1',
    '^@usecases/(.*)$': '<rootDir>/src/usecases/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@App/(.*)$': '<rootDir>/src/App/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
  },
  moduleDirectories: [
    "node_modules",
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['./jest.setup.ts'],
};

export default config;