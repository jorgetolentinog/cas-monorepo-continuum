const config = require("@package/jest-config");

module.exports = {
  ...config,
  collectCoverageFrom: ["src/**"],
};
