module.exports = function parseEligibility(detail) {

    const result = {
        eligibility: [],
        qualifications: [],
        whoCanApply: []
    };

    if (!detail?.tables?.length) {
        return result;
    }

    const qualificationSet = new Set();

    //-----------------------------------------
    // Scan Tables
    //-----------------------------------------

    for (const table of detail.tables) {

        if (!table.rows?.length) {
            continue;
        }

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
                line.includes("post") &&
                (
                    line.includes("eligibility") ||
                    line.includes("qualification")
                )
            ) {
                headerIndex = i;
                break;
            }

        }

        if (headerIndex === -1) {
            continue;
        }

        const header = rows[headerIndex].map(h => h.toLowerCase());

        //-----------------------------------------
        // Detect Columns
        //-----------------------------------------

        const postIndex = header.findIndex(h =>
            h.includes("post") ||
            h.includes("trade") ||
            h.includes("branch")
        );

        const qualificationIndex = header.findIndex(h =>
            h.includes("eligibility") ||
            h.includes("qualification") ||
            h.includes("education")
        );

        if (postIndex === -1 || qualificationIndex === -1) {
            continue;
        }

        //-----------------------------------------
        // Parse Rows
        //-----------------------------------------

        for (let i = headerIndex + 1; i < rows.length; i++) {

            const row = rows[i];

            if (!row.length) {
                continue;
            }


            const postName = (row[postIndex] || "").trim();

            let qualification = (
                row[qualificationIndex] || ""
            ).trim();

            qualification = qualification
                .replace(/\s*Age\s*Limit.*$/i, "")
                .trim();

            if (
                !postName ||
                !qualification ||
                /^post\s*name$/i.test(postName) ||
                /^eligibility\s*criteria$/i.test(qualification) ||
                /^(executive|technical|education)\s+branch$/i.test(postName)
            ) {
                continue;
            }

            qualification = qualification
                .replace(/\s*Age\s*Limit.*$/i, "")
                .trim();

            if (!postName || !qualification) {
                continue;
            }

            // Skip table headers
            if (
                /^post\s*name$/i.test(postName) ||
                /^eligibility\s*criteria$/i.test(qualification)
            ) {
                continue;
            }

            // Skip section titles
            if (
                /^(executive|technical|education)\s+branch$/i.test(postName)
            ) {
                continue;
            }

            result.eligibility.push({
                title: postName,
                qualification
            });

            const key = `${postName}|${qualification}`;

            if (!qualificationSet.has(key)) {

                qualificationSet.add(key);

                result.qualifications.push({
                    title: postName,
                    qualification
                });

            }

        }

    }

    //-----------------------------------------
    // Who Can Apply
    //-----------------------------------------

    const text = (detail.description || "").toLowerCase();

    if (text.includes("all india")) {
        result.whoCanApply.push("All India");
    }

    if (text.includes("male")) {
        result.whoCanApply.push("Male");
    }

    if (text.includes("female")) {
        result.whoCanApply.push("Female");
    }

    if (
        !result.whoCanApply.length &&
        text.includes("candidate")
    ) {
        result.whoCanApply.push("All Eligible Candidates");
    }

    if (!result.eligibility.length) {

        for (const table of detail.tables || []) {
    
            const text = table.rows
                .flat()
                .map(cell => cell.text || "")
                .join(" ")
                .trim();
    
            if (/eligibility\s*criteria/i.test(text)) {
    
                const qualification = text
                    .replace(/^.*?Eligibility\s*Criteria/i, "")
                    .replace(/For More Details.*$/i, "")
                    .trim();
    
                if (qualification) {
    
                    result.eligibility.push({
                        title: "Eligibility",
                        qualification
                    });
    
                    result.qualifications.push({
                        title: "Eligibility",
                        qualification
                    });
    
                }
    
                break;
            }
        }
    }

    return result;

};