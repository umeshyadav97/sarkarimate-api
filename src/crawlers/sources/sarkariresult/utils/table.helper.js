/**
 * Find a row that contains specific text
 */
const findRow = (tables, keyword) => {
    keyword = keyword.toLowerCase();

    for (const table of tables) {
        for (const row of table.rows) {
            for (const cell of row) {
                if (
                    cell.text &&
                    cell.text.toLowerCase().includes(keyword)
                ) {
                    return row;
                }
            }
        }
    }

    return null;
};

/**
 * Find all rows after a heading
 */
const findRowsAfterHeading = (tables, heading) => {
    heading = heading.toLowerCase();

    let capture = false;

    const rows = [];

    for (const table of tables) {
        for (const row of table.rows) {
            const text = row
                .map((c) => c.text)
                .join(" ")
                .toLowerCase();

            if (text.includes(heading)) {
                capture = true;
                continue;
            }

            if (!capture) continue;

            if (row.length === 1 && row[0].text.trim() === "") {
                break;
            }

            rows.push(row);
        }
    }

    return rows;
};

module.exports = {
    findRow,
    findRowsAfterHeading,
};