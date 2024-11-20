/** @type {import('jest').Config} */
const config = {

  clearMocks: true,

};

module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.(test|spec).js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo-status-bar|react-native-picker-select|expo-constants|expo-modules-core)/)',
  ],
  setupFiles: ['<rootDir>/__mocks__/expo-constants.js', '<rootDir>/__mocks__/expo-modules-core.js'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports',
        outputName: 'junit.xml',
      },
    ],
  ],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/mockAsyncStorage.js',
  },

};
