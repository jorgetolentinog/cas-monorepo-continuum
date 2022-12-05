const { pathsToModuleNameMapper } = require("ts-jest");
const { jsWithTs } = require("ts-jest/presets");

module.exports = {
  globals: {
    [require.resolve("ts-jest")]: {
      isolatedModules: true,
    },
  },
  resetMocks: true,
  restoreMocks: true,
  transform: jsWithTs.transform,
  collectCoverageFrom: ["src/**"],
};
