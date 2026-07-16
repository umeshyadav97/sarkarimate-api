module.exports = function parseBasic(detail) {

    const job = {

        title: detail.title,

        sourceUrl: detail.url,

        displaySection: detail.section,

        organization: "",

        description: "",

        shortDescription: "",

    };

    const paragraphs = [];

    for (const table of detail.tables) {

        for (const row of table.rows) {

            const text = row
                .map(cell => cell.text)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();

            if (!text) continue;

            paragraphs.push(text);

            const lower = text.toLowerCase();

            // Organization
            if (
                !job.organization &&
                (
                    lower.includes("organization") ||
                    lower.includes("department") ||
                    lower.includes("conducted by") ||
                    lower.includes("recruitment board")
                )
            ) {

                job.organization = row[row.length - 1]?.text || "";

            }

            // Name of Post
            if (
                !job.organization &&
                lower.includes("name of post")
            ) {

                job.organization = row[row.length - 1]?.text || "";

            }

        }

    }

    job.description = paragraphs.join("\n");

    job.shortDescription = paragraphs
        .slice(0, 5)
        .join(" ");

    return job;

};