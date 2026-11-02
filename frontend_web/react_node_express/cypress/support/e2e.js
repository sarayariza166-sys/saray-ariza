
import './commands.js';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
