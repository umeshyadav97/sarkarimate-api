function normalize(str = "") {
    return str
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function cleanQualification(text = "") {
    return text
        .replace(/\s*Age\s*Limit\s*:.*$/i, "")
        .replace(/\s+/g, " ")
        .trim();
}

module.exports = function parseTableVacancies(detail) {

    const result = {
        totalPosts: 0,
        qualification: "",
        vacancies: []
    };

    if (!detail.tables?.length) {
        return result;
    }

    for (const table of detail.tables) {

        const rows = table.rows.map(row =>
            row.map(cell => (cell.text || "").trim())
        );

        let mode = "";
        let currentVacancy = null;

        for (let i = 0; i < rows.length; i++) {

            const row = rows[i];

            if (!row.length) continue;

            const text = row.join(" ").toLowerCase();

            //----------------------------------
            // Detect vacancy header
            //----------------------------------

            if (
                text.includes("post name") &&
                (
                    text.includes("no. of post") ||
                    text.includes("no of post") ||
                    text.includes("total post")
                )
            ) {
                mode = "vacancy";
                continue;
            }

            //----------------------------------
            // Detect eligibility header
            //----------------------------------

            if (
                text.includes("post name") &&
                text.includes("eligibility")
            ) {
                mode = "eligibility";
                continue;
            }

            //----------------------------------
            // Ignore section titles
            //----------------------------------

            if (
                text.includes("executive branch") ||
                text.includes("technical branch") ||
                text.includes("education branch") ||
                text.includes("branch (total") ||
                text.includes("trade")
            ) {
                continue;
            }

            //----------------------------------
            // VACANCIES
            //----------------------------------

            if (mode === "vacancy") {

                if (row.length >= 2) {

                    const postName = row[0];

                    const totalPosts =
                        Number(row[1].replace(/[^\d]/g, "")) || 0;

                    if (postName) {

                        result.vacancies.push({
                            postName,
                            totalPosts,
                            qualification: ""
                        });

                        result.totalPosts += totalPosts;
                    }

                    continue;
                }

                //----------------------------------
                // Handle rowspan rows
                //----------------------------------

                if (
                    row.length === 1 &&
                    result.vacancies.length
                ) {

                    const extra =
                        Number(row[0].replace(/[^\d]/g, "")) || 0;

                    if (extra) {

                        const last =
                            result.vacancies[result.vacancies.length - 1];

                        last.totalPosts += extra;

                        result.totalPosts += extra;
                    }
                }
            }

            //----------------------------------
            // ELIGIBILITY
            //----------------------------------

            if (mode === "eligibility") {

                // Normal row
                if (row.length >= 2) {

                    const postName = row[0];

                    currentVacancy = result.vacancies.find(
                        v => normalize(v.postName) === normalize(postName)
                    );

                    if (currentVacancy) {

                        currentVacancy.qualification = cleanQualification(
                            row.slice(1).join(" ")
                        );

                    }

                    continue;
                }

                // Rowspan continuation
                if (row.length === 1 && currentVacancy) {

                    currentVacancy.qualification =
                        cleanQualification(
                            currentVacancy.qualification + " OR " + row[0]
                        );

                    continue;
                }
            }
        }
    }

    //----------------------------------
    // Overall qualification
    //----------------------------------

    result.qualification = result.vacancies
        .map(v => v.qualification)
        .filter(Boolean)
        .join(" | ");

    //----------------------------------
    // Fallback total post
    //----------------------------------

    if (!result.totalPosts) {

        const match = (detail.description || "").match(
            /Total\s+Post[s]?\s*:?\s*(\d+)/i
        );

        if (match) {
            result.totalPosts = Number(match[1]);
        }
    }

    console.log("=================================");
    console.log("JOB AFTER MAPPING");
    console.log(result);
    console.log("=================================");

    return result;
};