module.exports = function parseVacancies(detail) {

    const result = {

        totalPosts: 0,

        qualification: "",

        vacancies: []

    };

    if (!detail.tables?.length) {

        return result;

    }

    const qualificationSet = new Set();

    //----------------------------------------------------
    // Scan every table
    //----------------------------------------------------

    for (const table of detail.tables) {

        if (!table.rows?.length) continue;

        const rows = table.rows.map(row =>
            row.map(cell => (cell.text || "").trim())
        );

        const header = rows[0]
            .join(" ")
            .toLowerCase();

        //----------------------------------------------------
        // Ignore category tables
        //----------------------------------------------------

        if (
            header.includes("category") &&
            !header.includes("post")
        ) {
            continue;
        }

        //----------------------------------------------------
        // Detect vacancy table
        //----------------------------------------------------

        if (
            !header.includes("post") &&
            !header.includes("trade") &&
            !header.includes("branch")
        ) {
            continue;
        }

        if (
            !(
                header.includes("vacancy") ||
                header.includes("total post") ||
                header.includes("no. of post") ||
                header.includes("no of post") ||
                header.includes("seat")
            )
        ) {
            continue;
        }

        //----------------------------------------------------
        // Parse rows
        //----------------------------------------------------

        for (let i = 1; i < rows.length; i++) {

            const row = rows[i];

            if (row.length < 2) continue;

            const postName = row[0].trim();

            if (
                !postName ||
                /^total$/i.test(postName) ||
                /^grand total$/i.test(postName)
            ) {
                continue;
            }

            const totalPosts =
                Number(
                    (row[1] || "")
                        .replace(/[^\d]/g, "")
                ) || 0;

            if (!totalPosts) continue;

            const qualification =
                row.length >= 3
                    ? row
                          .slice(2)
                          .join(" ")
                          .trim()
                    : "";

            result.vacancies.push({

                postName,

                totalPosts,

                qualification

            });

            result.totalPosts += totalPosts;

            if (qualification) {

                qualificationSet.add(
                    qualification
                );

            }

        }

    }

    result.qualification =
        [...qualificationSet].join(" | ");

    //----------------------------------------------------
    // Remove duplicate posts
    //----------------------------------------------------

    const seen = new Set();

    result.vacancies =
        result.vacancies.filter(v => {

            const key =
                `${v.postName}_${v.totalPosts}`;

            if (seen.has(key))
                return false;

            seen.add(key);

            return true;

        });

    return result;

};