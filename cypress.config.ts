import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    video: false, // Disable video recording by default
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2, // Retry failed tests up to 2 times in CI
      openMode: 0,
    },
  },
});
