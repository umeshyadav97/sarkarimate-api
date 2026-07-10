const dns = require("dns");
const mongoose = require("mongoose");

let cachedConnection = null;
let dnsConfigured = false;

const configureDns = () => {
    if (dnsConfigured || !process.env.DNS_SERVERS) {
        return;
    }

    const servers = process.env.DNS_SERVERS
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);

    if (servers.length > 0) {
        dns.setServers(servers);
        dnsConfigured = true;
    }
};

const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        configureDns();

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not configured");
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);

        cachedConnection = conn;

        console.log(`MongoDB connected: ${conn.connection.host}`);

        return conn;
    } catch (error) {
        console.error("MongoDB connection failed");
        console.error(error.message);

        if (process.env.VERCEL) {
            throw error;
        }

        process.exit(1);
    }
};

module.exports = connectDB;
