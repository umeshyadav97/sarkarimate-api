module.exports = function parseVacancies(detail) {

    const result = {
        totalPosts: 0,
        qualification: "",
        vacancies: []
    };

    if (!detail?.tables?.length) {
        return result;
    }

    const qualificationSet = new Set();

    //----------------------------------------------------
    // Helper : Extract qualification from description
    //----------------------------------------------------

    function extractQualification(description = "") {

        if (!description) {
            return "";
        }

        const patterns = [

            /Bachelor['’`s]*\s+degree.*?(?=How To Fill|Mode of Selection|Important Links|$)/i,

            /Master['’`s]*\s+degree.*?(?=How To Fill|Mode of Selection|Important Links|$)/i,

            /Diploma.*?(?=How To Fill|Mode of Selection|Important Links|$)/i,

            /ITI.*?(?=How To Fill|Mode of Selection|Important Links|$)/i,

            /10\+2.*?(?=How To Fill|Mode of Selection|Important Links|$)/i,

            /10th.*?(?=How To Fill|Mode of Selection|Important Links|$)/i,

            /12th.*?(?=How To Fill|Mode of Selection|Important Links|$)/i

        ];

        for (const regex of patterns) {

            const match = description.match(regex);

            if (match) {

                return match[0]
                    .replace(/\s+/g, " ")
                    .trim();

            }

        }

        return "";

    }

    //----------------------------------------------------
    // Scan Tables
    //----------------------------------------------------

    for (const table of detail.tables) {

        if (!table.rows?.length) {
            continue;
        }

        const rows = table.rows.map(row =>
            row.map(cell => (cell.text || "").trim())
        );

        const header = rows[0].map(h => h.toLowerCase().trim());

        console.log("HEADER =>", header);
console.log("ROWS =>", rows);

        //----------------------------------------------------
        // Detect Columns
        //----------------------------------------------------

        let postIndex = -1;
        let vacancyIndex = -1;
        let qualificationIndex = -1;

        header.forEach((col, index) => {

            if (
                qualificationIndex === -1 &&
                /(eligibility|qualification|education)/i.test(col)
            ) {
                qualificationIndex = index;
            }

            if (
                vacancyIndex === -1 &&
                (
                    /no\.?\s*of\s*post/i.test(col) ||
                    /no\.?\s*of\s*posts/i.test(col) ||
                    /^vacancy$/i.test(col) ||
                    /^vacancies$/i.test(col) ||
                    /^posts$/i.test(col) ||
                    /^total\s*post/i.test(col)
                )
            ) {
                vacancyIndex = index;
            }

            if (
                postIndex === -1 &&
                (
                    /^post\s*name$/i.test(col) ||
                    /^post$/i.test(col) ||
                    /^designation$/i.test(col) ||
                    /^trade$/i.test(col) ||
                    /^branch$/i.test(col)
                )
            ) {
                postIndex = index;
            }

        });

        if (postIndex === -1 || vacancyIndex === -1) {
            continue;
        }

        //----------------------------------------------------
        // Parse Rows
        //----------------------------------------------------

        for (let i = 1; i < rows.length; i++) {

            const row = rows[i];

            if (!row.length) {
                continue;
            }

            const postName = (row[postIndex] || "").trim();

            if (
                !postName ||
                /^total$/i.test(postName) ||
                /^grand total$/i.test(postName)
            ) {
                continue;
            }

            const totalPosts = parseInt(
                (row[vacancyIndex] || "").replace(/[^\d]/g, ""),
                10
            ) || 0;

            if (!totalPosts) {
                continue;
            }

            let qualification = "";

            if (
                qualificationIndex !== -1 &&
                row[qualificationIndex]
            ) {
                qualification = row[qualificationIndex].trim();
            }

            //----------------------------------------------------
            // Fallback from description
            //----------------------------------------------------

            if (!qualification) {
                qualification = extractQualification(
                    detail.description || ""
                );
            }

            result.vacancies.push({
                postName,
                totalPosts,
                qualification
            });

            result.totalPosts += totalPosts;

            if (qualification) {
                qualificationSet.add(qualification);
            }

        }

    }

    //----------------------------------------------------
    // Remove Duplicate Posts
    //----------------------------------------------------

    const seen = new Set();

    result.vacancies = result.vacancies.filter(item => {

        const key = `${item.postName}_${item.totalPosts}`;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;

    });

    //----------------------------------------------------
    // Final Qualification
    //----------------------------------------------------

    result.qualification = [...qualificationSet].join(" | ");

    return result;

};