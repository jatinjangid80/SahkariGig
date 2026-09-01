// Vercel Serverless Function Entrypoint
// This forwards all /api/* requests to the main Express app in server/server.js
const app = require('../server/server.js');

module.exports = (req, res) => {
  return app(req, res);
};
