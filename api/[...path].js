// const app = require("../src/app");

module.exports = (req, res) => {
    console.log("🔥 API HIT (path):", req.url);
    return app(req, res);
};