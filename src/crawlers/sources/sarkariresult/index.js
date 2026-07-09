const { BASE_URL } = require("./constants");
const { fetchHtml } = require("../../core/http");
const { parseListingPage } = require("./listing.parser");

const crawlHomePage = async () => {
    console.log("Downloading Homepage...");

    const html = await fetchHtml(BASE_URL);

    console.log("Parsing Homepage...");

    const notifications = parseListingPage(html);

    console.log(`Found ${notifications.length} notifications`);

    return notifications;
};

module.exports = {
    crawlHomePage,
};