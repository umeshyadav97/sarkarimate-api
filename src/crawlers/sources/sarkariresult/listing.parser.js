const cheerio = require("cheerio");
const fs = require("fs");

const BASE_URL = "https://www.sarkariresult.com";

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

    if (!url.startsWith(BASE_URL))
        return false;

    // Remove fragments & trailing slash
    url = url.split("#")[0].replace(/\/$/, "");

    // Skip static assets
    if (
        url.endsWith(".jpg") ||
        url.endsWith(".jpeg") ||
        url.endsWith(".png") ||
        url.endsWith(".gif") ||
        url.endsWith(".svg") ||
        url.endsWith(".pdf") ||
        url.endsWith(".zip")
    ) {
        return false;
    }

    // Skip navigation pages
    const skip = [
        "/contact",
        "/about",
        "/privacy",
        "/terms",
        "/search",
        "/advertise",
        "/login",
        "/category",
        "/syllabus",
        "/admission"
    ];

    if (skip.some(x => url.includes(x)))
        return false;

    // Notification pages normally contain many path segments
    const path = url.replace(BASE_URL, "");

    return path.split("/").filter(Boolean).length >= 2;
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

        if (url.startsWith("/")) {
            url = BASE_URL + url;
        }

        url = url.split("#")[0].replace(/\/$/, "");

        if (!isNotification(url))
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

    console.log(
        `📌 ${section} -> ${notifications.length} notifications found`
    );

    // Debug first 10 notifications
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