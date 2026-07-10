require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { fetchHtml } = require("../crawlers/core/http");

async function start() {
    try {
        console.log("Downloading Latest Job Page...");

        const html = await fetchHtml(
            "https://www.sarkariresult.com/latestjob/"
        );

        fs.writeFileSync(
            path.join(__dirname, "../../latest-job.html"),
            html
        );

        console.log("✅ latest-job.html created.");
    } catch (err) {
        console.error(err);
    }
}

start();