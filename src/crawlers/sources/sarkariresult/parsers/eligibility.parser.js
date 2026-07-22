module.exports = function parseEligibility(detail) {

    const result = {
        eligibility: [],
        qualifications: [],
        whoCanApply: []
    };

    if (!detail.tables?.length) {
        return result;
    }

    const qualificationSet = new Set();

    //-----------------------------------------
    // Scan Tables
    //-----------------------------------------

    for (const table of detail.tables) {

        if (!table.rows?.length) continue;

        const rows = table.rows.map(row =>
            row.map(cell => (cell.text || "").trim())
        );

        //-----------------------------------------
        // Find Header Row
        //-----------------------------------------

        let headerIndex = -1;

        for (let i = 0; i < Math.min(rows.length, 5); i++) {

            const line = rows[i].join(" ").toLowerCase();

            if (
                line.includes("post name") &&
                (
                    line.includes("eligibility") ||
                    line.includes("qualification")
                )
            ) {
                headerIndex = i;
                break;
            }

            if (line.includes("educational qualification")) {
                headerIndex = i;
                break;
            }

        }

        if (headerIndex === -1)
            continue;

        const header = rows[headerIndex]
            .join(" ")
            .toLowerCase();

        //-----------------------------------------
        // Post Name | Eligibility
        //-----------------------------------------

        if (
            header.includes("post name") &&
            (
                header.includes("eligibility") ||
                header.includes("qualification")
            )
        ) {

            for (let i = headerIndex + 1; i < rows.length; i++) {

                const row = rows[i];

                if (row.length < 2)
                    continue;

                const postName = row[0].trim();

                let qualification = row
                    .slice(1)
                    .join(" ")
                    .trim();

                qualification = qualification.replace(
                    /\s*Age\s*Limit\s*:.*$/i,
                    ""
                ).trim();

                if (
                    postName.toLowerCase() === "post name" ||
                    qualification.toLowerCase() === "eligibility criteria"
                ) {
                    continue;
                }
                if (!postName)
                    continue;

                if (!qualification)
                    continue;

                result.eligibility.push({

                    title: postName,

                    qualification

                });

                if (!qualificationSet.has(qualification)) {

                    qualificationSet.add(qualification);

                    result.qualifications.push({

                        title: postName,

                        qualification

                    });

                }

            }

        }

        //-----------------------------------------
        // Qualification Table
        //-----------------------------------------

        else if (
            header.includes("qualification")
        ) {

            for (let i = headerIndex + 1; i < rows.length; i++) {

                const qualification = rows[i]
                    .join(" ")
                    .trim();

                if (!qualification)
                    continue;

                if (!qualificationSet.has(qualification)) {

                    qualificationSet.add(qualification);

                    result.qualifications.push({

                        title: "Qualification",

                        qualification

                    });

                }

            }

        }

    }

    //-----------------------------------------
    // Who Can Apply
    //-----------------------------------------

    const text = (
        detail.description || ""
    ).toLowerCase();

    if (text.includes("all india"))
        result.whoCanApply.push("All India");

    if (text.includes("male"))
        result.whoCanApply.push("Male");

    if (text.includes("female"))
        result.whoCanApply.push("Female");

    if (
        result.whoCanApply.includes("Male") &&
        result.whoCanApply.includes("Female")
    ) {

        result.whoCanApply = ["Male", "Female"];

    }

    if (
        !result.whoCanApply.length &&
        text.includes("candidate")
    ) {

        result.whoCanApply.push("All Eligible Candidates");

    }

    return result;

};