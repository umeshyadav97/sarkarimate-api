const { fetchHtml } = require("../../core/http");
const { SECTIONS } = require("./constants");

const crawlSections = async () => {
    const pages = [];

    for (const item of SECTIONS) {
        console.log(`Downloading ${item.section}...`);

        const html = await fetchHtml(item.url);

        pages.push({
            section: item.section,
            url: item.url,
            html,
        });
    }

    return pages;
};

const crawlDetailPage = async (url) => {
    return await fetchHtml(url);
};

module.exports = {
    crawlSections,
    crawlDetailPage,
};