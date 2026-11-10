
module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  testMatch: ['**/src/test/**/*.test.jsx'],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  clearMocks: true,

  verbose: true,

  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports/frontend',
        filename: 'reporte-frontend.html',
        expand: true,
        pageTitle: 'Reporte de Pruebas - Frontend React',
        hideIcon: false,
      },
    ],
  ],
};

