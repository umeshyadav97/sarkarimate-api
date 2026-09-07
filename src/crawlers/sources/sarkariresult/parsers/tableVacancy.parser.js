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

        const rawRows = table.rows;

        const rows = rawRows.map(row =>
            row.map(cell => (cell.text || "").trim())
        );

        let mode = "";
        let currentVacancy = null;
        let isDistrictTable = false;

        for (let i = 0; i < rows.length; i++) {

            const row = rows[i];
            const rawRow = rawRows[i];

            if (!row.length) continue;

            const text = row.join(" ").toLowerCase();

            //----------------------------------
            // Detect Vacancy Header
            //----------------------------------

            if (
                (
                    text.includes("post name") ||
                    text.includes("district name") ||
                    text.includes("district") ||
                    text.includes("location")
                ) &&
                (
                    text.includes("no. of post") ||
                    text.includes("no of post") ||
                    text.includes("total post")
                )
            ) {

                mode = "vacancy";
                isDistrictTable =
                    text.includes("district name") ||
                    text.includes("district");

                continue;
            }

            //----------------------------------
            // Detect Eligibility Header
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
                        Number((row[1] || "").replace(/[^\d]/g, "")) || 0;

                    if (!postName || !totalPosts) {
                        continue;
                    }

                    const vacancy = {
                        postName,
                        totalPosts,
                        qualification: ""
                    };

                    if (isDistrictTable) {

                        vacancy.lastDate = row[2] || "";
                        vacancy.notification = row[3] || "";
console.dir(rawRow[3], { depth: null });
                        const href = rawRow?.[3]?.href || "";

                        if (
                            href &&
                            !/sarkariresult\.com/i.test(href)
                        ) {
                            vacancy.notificationUrl = href;
                        }

                    }

                    //----------------------------------
                    // UP Anganwadi Support
                    //----------------------------------

                    if (isDistrictTable) {

                        vacancy.lastDate = row[2] || "";
                        vacancy.notification = row[3] || "";

                    }

                    result.vacancies.push(vacancy);

                    result.totalPosts += totalPosts;

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

                //----------------------------------
                // Rowspan continuation
                //----------------------------------

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