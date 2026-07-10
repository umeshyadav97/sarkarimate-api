module.exports.mapJob = function (detail) {
    const job = {
        title: detail.title,
        sourceUrl: detail.url,
        displaySection: detail.section,

        organization: "",
        shortDescription: "",
        qualification: "",
        applicationFee: "",
        ageLimit: "",
        totalPosts: 0,

        vacancies: [],
        importantDates: [],
        importantLinks: [],

        applyLink: "",
        notificationPdf: "",
        officialWebsite: "",
    };

    // Convert every row into plain text
    const allText = detail.tables.flatMap(table =>
        table.rows.map(row => row.map(cell => cell.text).join(" "))
    );

    for (const table of detail.tables) {

        for (const row of table.rows) {

            const text = row.map(cell => cell.text).join(" ");

            // ==========================
            // Organization
            // ==========================
            if (text.includes("Name Of Post")) {
                job.organization = row[1]?.text || "";
            }

            // ==========================
            // Short Description
            // ==========================
            if (text.includes("Short Information")) {
                job.shortDescription = row[1]?.text || "";
            }

            // ==========================
            // Age Limit
            // ==========================
            if (text.includes("Age Limit")) {
                job.ageLimit = text;
            }

            // ==========================
            // Application Fee
            // ==========================
            if (
                row.length >= 2 &&
                row[0].text.includes("Application Fee")
            ) {
                job.applicationFee = row[1].text;
            }

            // ==========================
            // Total Posts
            // ==========================
            if (text.includes("Vacancy Details")) {

                const match = text.match(/Total\s*:?\s*(\d+)/i);

                if (match) {
                    job.totalPosts = Number(match[1]);
                }
            }

            // ==========================
            // Vacancy Table
            // ==========================
            if (
                row.length === 3 &&
                row[0].text !== "Post Name" &&
                !isNaN(Number(row[1].text))
            ) {
                job.vacancies.push({
                    post: row[0].text,
                    posts: Number(row[1].text),
                    qualification: row[2].text,
                });

                if (!job.qualification) {
                    job.qualification = row[2].text;
                }
            }

            // ==========================
            // Important Links
            // ==========================
            if (row.length >= 2 && row[1].href) {

                job.importantLinks.push({
                    title: row[0].text,
                    url: row[1].href,
                });

                const title = row[0].text.toLowerCase();

                if (title.includes("apply")) {
                    job.applyLink = row[1].href;
                }

                if (title.includes("notification")) {
                    job.notificationPdf = row[1].href;
                }

                if (title.includes("official")) {
                    job.officialWebsite = row[1].href;
                }
            }
        }
    }

    // ==========================
    // Important Dates
    // ==========================
    const dateRow = allText.find(t => t.includes("Important Dates"));

    if (dateRow) {

        const labels = [
            "Application Begin",
            "Last Date for Apply Online",
            "Last Date Pay Exam Fee",
            "Form Correction Last Date",
            "Exam Date",
        ];

        labels.forEach(label => {

            const regex = new RegExp(`${label}\\s*:?\\s*([^A-Z]+)`, "i");

            const match = dateRow.match(regex);

            if (match) {
                job.importantDates.push({
                    title: label,
                    value: match[1].trim(),
                });
            }

        });

    }

    return job;
};