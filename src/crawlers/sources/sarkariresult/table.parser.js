const cheerio = require("cheerio");

/**
 * Extract all tables from Sarkari Result detail page
 */
const parseTables = (html) => {
    const $ = cheerio.load(html);

    const tables = [];

    $("table").each((tableIndex, table) => {

        const rows = [];

        $(table)
            .find("tr")
            .each((rowIndex, row) => {

                const cells = [];

                $(row)
                    .find("th, td")
                    .each((colIndex, col) => {

                        const text = $(col)
                            .text()
                            .replace(/\s+/g, " ")
                            .trim();

                        const anchor = $(col).find("a").first();

                        const href = anchor.attr("href") || "";

                        cells.push({
                            text,
                            href
                        });

                    });

                if (cells.length) {
                    rows.push(cells);
                }

            });

        if (rows.length) {

            tables.push({
                tableIndex,
                rows
            });

        }

    });

    return tables;
};

module.exports = {
    parseTables
};