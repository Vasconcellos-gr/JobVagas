const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // O endereço do seu servidor local
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});