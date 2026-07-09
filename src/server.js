const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const jobRoutes = require("./routes/job.routes");

const router = express.Router();
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
router.use("/jobs", jobRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});