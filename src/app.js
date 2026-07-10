const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

dotenv.config();

require("./models");

const connectDB = require("./config/db");
const jobRoutes = require("./routes/job.routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

connectDB();

const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SarkariMate API",
        health: "/api/health",
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SarkariMate API is running",
        environment: process.env.NODE_ENV,
        timestamp: new Date(),
    });
});

app.use("/api/v1/jobs", jobRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
