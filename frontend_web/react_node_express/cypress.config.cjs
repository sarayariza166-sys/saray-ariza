
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5174",
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,

    retries: {
      runMode: 1,
      openMode: 0,
    },

    video: true,
    screenshotOnRunFailure: true,
    reporter: "spec",

    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",

    setupNodeEvents(on, config) {
      return config;
    },
  },
});
