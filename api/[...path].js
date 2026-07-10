// const app = require("../src/app");
// const connectDB = require("../src/config/db");

// const handler = async (req, res) => {
//     await connectDB();
//     return app(req, res);
// };

// module.exports = handler;


const app = require("../src/app");
const connectDB = require("../src/config/db");

module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error("❌ API Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};