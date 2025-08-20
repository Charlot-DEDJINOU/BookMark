const app = require("../dist/src/app").default; // importe ton app Express compilée

module.exports = (req, res) => {
  return app(req, res); // Vercel attend une fonction (req,res)
};