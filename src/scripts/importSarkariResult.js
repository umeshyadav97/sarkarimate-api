require("dotenv").config();

const connectDB = require("../config/db");

const {
    crawlHomePage,
} = require("../crawlers/sources/sarkariresult");

const start = async () => {
    try {
        await connectDB();

        console.log("MongoDB Connected");

        const jobs = await crawlHomePage();

        console.log("Total Links:", jobs.length);

        const fs = require("fs");

        const html = await require("../crawlers/core/http").fetchHtml(
            "https://www.sarkariresult.com/"
        );
        
        fs.writeFileSync("homepage.html", html);
        
        console.log("Homepage saved successfully.");

        process.exit(0);
    } catch (err) {
        console.error(err);

        process.exit(1);
    }
};

start();