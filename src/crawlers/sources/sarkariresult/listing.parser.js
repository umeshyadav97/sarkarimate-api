const cheerio = require("cheerio");

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
    "syllabus",
    "admission",
    "answer key",
    "latest jobs",
    "latest job",
    "results",
    "admit card",
];

function isNotification(url) {
    return (
        url.includes("/202") ||
        url.includes("/railway/") ||
        url.includes("/upsc/") ||
        url.includes("/ssc/") ||
        url.includes("/bank/") ||
        url.includes("/bihar/") ||
        url.includes("/upsssc/") ||
        url.includes("/nta/") ||
        url.includes("/mp/") ||
        url.includes("/delhi/")
    );
}

const parseListingPage = ({ html, section }) => {
    const $ = cheerio.load(html);

    const notifications = [];
    const visited = new Set();

    $(".entry-content a").each((_, el) => {
        let title = $(el).text().trim();

        let url = $(el).attr("href");

        if (!title || !url) return;

        title = title.replace(/\s+/g, " ").trim();

        if (url.startsWith("/")) {
            url = BASE_URL + url;
        }

        if (!url.startsWith(BASE_URL)) return;

        if (!isNotification(url)) return;

        const lower = title.toLowerCase();

        if (INVALID_TITLES.some((x) => lower.includes(x))) return;

        if (visited.has(url)) return;

        visited.add(url);

        notifications.push({
            title,
            url,
            section,
        });
    });

    return notifications;
};

module.exports = {
    parseListingPage,
};