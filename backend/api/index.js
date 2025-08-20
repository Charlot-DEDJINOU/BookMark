const app = require("../dist/app").default; // importe ton app Express compilée

module.exports = (req, res) => {
  return app(req, res); // Vercel attend une fonction (req,res)
};