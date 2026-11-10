
module.exports = {
  testEnvironment: 'node',

  testMatch: ['**/test/**/*.test.js'],

  setupFiles: ['<rootDir>/jest.setup.js'],

  verbose: true,
  forceExit: true,
  clearMocks: true,

  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports/backend',
        filename: 'reporte-backend.html',
        expand: true,
        pageTitle: 'Reporte de Pruebas - Backend Node.js',
        hideIcon: false,
      },
    ],
  ],
};
