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
        // Extract page text
        //------------------------------------

        const $ = cheerio.load(html);

        console.log("\n========================================");
        console.log("PAGE TITLE:");
        console.log($("title").text());

        console.log("\n========================================");
        console.log("BODY LENGTH:");
        console.log($("body").text().length);

        let description = "";

        // Try common content containers first
        const selectors = [
            ".entry-content",
            ".post-content",
            ".single-content",
            ".td-post-content",
            ".content",
            "article"
        ];

        for (const selector of selectors) {

            const text = $(selector)
                .first()
                .text()
                .replace(/\s+/g, " ")
                .trim();

            if (text.length > 500) {
                description = text;
                break;
            }

        }

        // Fallback
        if (!description) {

            description = $("body")
                .text()
                .replace(/\s+/g, " ")
                .trim();

        }

        //------------------------------------
        // Debug Output
        //------------------------------------

        console.log("\n================ DESCRIPTION START ================\n");
        console.log(description.substring(0, 5000));
        console.log("\n================ DESCRIPTION END ==================\n");

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