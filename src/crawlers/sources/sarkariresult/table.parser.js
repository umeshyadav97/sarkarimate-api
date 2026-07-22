const cheerio = require("cheerio");

const BASE_URL = "https://www.sarkariresult.com";

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

                        const cell = $(col);

                        const text = cell
                            .text()
                            .replace(/\s+/g, " ")
                            .trim();

                        // Extract every link
                        const links = [];

                        cell.find("a").each((_, a) => {

                            let href = $(a).attr("href") || "";

                            if (href.startsWith("/")) {
                                href = BASE_URL + href;
                            }

                            links.push({
                                text: $(a).text().trim(),
                                href,
                            });

                        });

                        cells.push({

                            text,

                            href: links.length
                                ? links[0].href
                                : "",

                            links,

                            rowspan:
                                Number(cell.attr("rowspan")) || 1,

                            colspan:
                                Number(cell.attr("colspan")) || 1,

                        });

                    });

                if (cells.length) {

                    rows.push(cells);

                }

            });

        if (!rows.length) return;

        const caption =
            $(table).find("caption").text().trim() || "";

        tables.push({

            tableIndex,

            caption,

            rows,

        });

    });

    console.log(`📊 Parsed ${tables.length} tables`);

    console.log("\n================ TABLES ================\n");

tables.forEach((table, index) => {

    console.log(`\nTABLE ${index}`);

    table.rows.forEach((row, i) => {

        console.log(
            `Row ${i}:`,
            row.map(cell => cell.text)
        );

    });

});

console.log("\n========================================\n");

    return tables;
};

module.exports = {
    parseTables,
};