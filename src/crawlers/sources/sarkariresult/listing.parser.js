const cheerio = require("cheerio");
const fs = require("fs");

const { BASE_URL } = require("./constants");

const INVALID_TITLES = [
    "home",
    "contact",
    "about",
    "privacy",
    "terms",
    "telegram",
    "facebook",
    "instagram",
    "youtube",
    "twitter",
    "whatsapp",
];

/**
 * Detect whether URL is a notification page
 */
function isNotification(url) {

    if (!url) return false;

    try {

        // Remove anchor and trailing slash
        url = url.split("#")[0].replace(/\/$/, "");

        const parsed = new URL(url);

        // Accept both www and non-www
        const hostname = parsed.hostname.replace(/^www\./, "");

        if (hostname !== "sarkariresult.com.cm") {
            return false;
        }

        // Get page slug
        const slug = parsed.pathname.replace(/^\/|\/$/g, "");

        // Ignore listing pages
        const skip = new Set([
            "",
            "latest-jobs",
            "result",
            "admit-card",
            "answer-key",
            "syllabus",
            "admission",
            "contact",
            "privacy-policy",
            "disclaimer",
            "latest-posts"
        ]);

        if (skip.has(slug)) {
            return false;
        }

        // Notification pages contain only one path segment
        return !slug.includes("/");

    } catch (err) {
        return false;
    }
}

const parseListingPage = ({ html, section }) => {

    const $ = cheerio.load(html);

    fs.writeFileSync(`debug-${section}.html`, html);

    console.log("Page Title:", $("title").text());

    const notifications = [];
    const visited = new Set();

    $("a[href]").each((_, el) => {

        let title = $(el)
            .text()
            .replace(/\s+/g, " ")
            .trim();

        let url = $(el).attr("href");

        if (!title || !url)
            return;

        // Convert relative URLs to absolute
        if (url.startsWith("/")) {
            url = new URL(url, BASE_URL).href;
        }

        // Normalize
        url = url.split("#")[0].replace(/\/$/, "");

        const valid = isNotification(url);

        console.log("TITLE:", title);
        console.log("URL:", url);
        console.log("VALID:", valid);

        if (!valid)
            return;

        if (INVALID_TITLES.includes(title.toLowerCase()))
            return;

        if (visited.has(url))
            return;

        visited.add(url);

        notifications.push({
            title,
            url,
            section,
        });

    });

    console.log(`📌 ${section} -> ${notifications.length} notifications found`);

    console.log("\nFirst 10 Notifications:");

    notifications.slice(0, 10).forEach((item, i) => {
        console.log(`${i + 1}. ${item.title}`);
        console.log(item.url);
    });

    return notifications;
};

module.exports = {
    parseListingPage,
};