module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
};