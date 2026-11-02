module.exports = {
  testEnvironment: 'node',

  testMatch: ['**/test/**/*.test.js'],

  setupFiles: ['<rootDir>/jest.setup.js'],

  verbose: true,
  forceExit: true,
  clearMocks: true,

  reporters: ['default'],
};