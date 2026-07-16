module.exports = function parseEligibility(detail) {

    const result = {
        eligibility: [],
        qualifications: [],
        whoCanApply: []
    };

    if (!detail.tables?.length) {
        return result;
    }

    //------------------------------------
    // Find Vacancy Table
    //------------------------------------

    let vacancyTable = null;

    for (const table of detail.tables) {

        if (!table.rows?.length) continue;

        const rows = table.rows.map(row =>
            row.map(cell => (cell.text || "").trim())
        );

        const header = rows[0].join(" ").toLowerCase();

        if (
            header.includes("post name") &&
            header.includes("total post")
        ) {
            vacancyTable = rows;
            break;
        }
    }

    if (!vacancyTable) {
        return result;
    }

    //------------------------------------
    // Parse Eligibility
    //------------------------------------

    for (let i = 1; i < vacancyTable.length; i++) {

        const row = vacancyTable[i];

        if (row.length < 3) continue;

        const postName = row[0].trim();

        const qualification = row
            .slice(2)
            .join(" ")
            .trim();

        if (!postName || !qualification) continue;

        result.eligibility.push({

            title: postName,

            qualification

        });

        result.qualifications.push({

            title: postName,

            qualification

        });

    }

    //------------------------------------
    // Remove duplicate qualifications
    //------------------------------------

    result.qualifications = result.qualifications.filter(
        (item, index, self) =>
            index === self.findIndex(
                t => t.qualification === item.qualification
            )
    );

    return result;

};