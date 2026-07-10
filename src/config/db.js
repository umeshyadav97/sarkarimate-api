const dns = require("dns");
const mongoose = require("mongoose");

let cachedConnection = null;
let connectingPromise = null;
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

    if (connectingPromise) {
        return connectingPromise;
    }

    configureDns();

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured");
    }

    connectingPromise = mongoose
        .connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        })
        .then((conn) => {
            cachedConnection = conn;
            connectingPromise = null;

            console.log(`✅ MongoDB connected: ${conn.connection.host}`);

            return conn;
        })
        .catch((error) => {
            connectingPromise = null;

            console.error("❌ MongoDB connection failed");
            console.error(error);

            throw error;
        });

    return connectingPromise;
};

module.exports = connectDB;