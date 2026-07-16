const { fetchHtml } = require("../../core/http");
const { parseTables } = require("./table.parser");
const cheerio = require("cheerio");

/**
 * Download Detail Page
 */
const getDetailPage = async (notification) => {

    try {

        console.log(`📥 Downloading: ${notification.title}`);

        const html = await fetchHtml(notification.url);

        if (!html) {
            throw new Error("Empty HTML received");
        }

        const tables = parseTables(html);

        console.log(`   ✅ Parsed ${tables.length} tables`);

        //------------------------------------
        // Extract plain text from page
        //------------------------------------

        const $ = cheerio.load(html);

        const description = $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim();

        //------------------------------------

        return {

            title: notification.title,

            url: notification.url,

            section: notification.section,

            html,

            description,

            tables,

            crawledAt: new Date(),

        };

    } catch (error) {

        console.error(`❌ Failed: ${notification.title}`);
        console.error(error.message);

        return null;
    }

};

module.exports = {
    getDetailPage,
};