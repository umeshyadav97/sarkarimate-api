module.exports = function parseFaq(detail) {

    if (!detail?.tables?.length) {
        return [];
    }

    const faqs = [];

    for (const table of detail.tables) {

        if (!table.rows?.length) {
            continue;
        }

        for (const row of table.rows) {

            const text = row
                .map(cell => cell.text || "")
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();

            if (!/Question\s*:/i.test(text)) {
                continue;
            }

            const match = text.match(
                /Question\s*:\s*(.*?)\s*Answer\s*:\s*(.*)$/i
            );

            if (!match) {
                continue;
            }

            const question = match[1].trim();

            const answer = match[2].trim();

            if (!question || !answer) {
                continue;
            }

            faqs.push({
                question,
                answer
            });

        }

    }

    return faqs;

};