const { create } = require("axios");

const TIMEOUT = Number(process.env.TIMEOUT_SECONDS);

module.exports = create({
  timeout: (TIMEOUT && TIMEOUT * 1000) || 30 * 1000,
});
