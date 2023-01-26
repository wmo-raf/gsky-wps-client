require("dotenv").config({ silent: true }); // NOTE: make sure dot env is loaded first

const logger = require("logger");

require("app")().then(
  () => {
    logger.info("Server running");
  },
  (err) => {
    logger.error("Error running server", err);
  }
);