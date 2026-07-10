const app = require("../src/app");
const connectDB = require("../src/config/db");

const handler = async (req, res) => {
    await connectDB();
    return app(req, res);
};

module.exports = handler;
