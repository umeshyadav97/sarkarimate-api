const { fetchHtml } = require("../../core/http");

const {
    parseTables,
} = require("./table.parser");

/**
 * Download Detail Page
 */
const getDetailPage = async (notification) => {

    console.log(
        `Downloading: ${notification.title}`
    );

    const html = await fetchHtml(notification.url);

    const tables = parseTables(html);

    return {

        ...notification,

        html,

        tables

    };

};

module.exports = {
    getDetailPage
};