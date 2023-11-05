import { defineConfig } from "cypress";
require("dotenv").config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      testEmail: process.env.TEST_EMAIL,
      testPassword: process.env.TEST_PASSWORD,
      testTotpSecret: process.env.TEST_TOTP_SECRET,
    },
  },
});
