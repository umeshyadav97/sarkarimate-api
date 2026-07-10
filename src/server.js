const express = require("express");
const dotenv = require("dotenv");
require("./models");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const jobRoutes = require("./routes/job.routes");


const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SarkariMate API is running 🚀",
        environment: process.env.NODE_ENV,
        timestamp: new Date()
    });
});
app.use("/api/v1/jobs", jobRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});