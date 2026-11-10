
const { defineConfig } = require("cypress");
const { merge } = require("mochawesome-merge");
const marge = require("mochawesome-report-generator");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,

    retries: {
      runMode: 1,
      openMode: 0,
    },

    video: true,
    screenshotOnRunFailure: true,

    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports/html",
      overwrite: false,
      html: false,
      json: true,
    },

    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",

    setupNodeEvents(on, config) {
      on("after:run", async () => {
        const jsonReport = await merge({
          files: ["cypress/reports/html/*.json"],
        });

        await marge.create(jsonReport, {
          reportDir: "cypress/reports/html",
          reportFilename: "reporte-cypress",
          reportTitle: "Reporte de Pruebas E2E - Cypress",
          inline: true,
        });

        console.log("Reporte HTML de Cypress generado exitosamente.");
      });

      return config;
    },
  },
});
