// const app = require("../src/app");
// const connectDB = require("../src/config/db");

// const handler = async (req, res) => {
//     await connectDB();
//     return app(req, res);
// };

// module.exports = handler;
const app = require("../src/app");

module.exports = (req, res) => {
    console.log("🔥 API HIT (index):", req.url);
    return app(req, res);
};