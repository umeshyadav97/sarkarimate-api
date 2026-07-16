module.exports = function parseVacancies(detail) {

    const result = {

        totalPosts: 0,

        qualification: "",

        vacancies: []

    };

    if (!detail.tables || !detail.tables.length) {
        return result;
    }

    //-----------------------------------------
    // Find Vacancy Table
    //-----------------------------------------

    let vacancyTable = null;

    for (const table of detail.tables) {

        const text = table.rows
            .flat()
            .map(c => c.text)
            .join(" ")
            .toLowerCase();

        if (
            text.includes("post name") &&
            text.includes("total post")
        ) {
            vacancyTable = table;
            break;
        }
    }

    console.log(
        JSON.stringify(vacancyTable, null, 2)
        );

    if (!vacancyTable) {
        return result;
    }

    //-----------------------------------------
    // Skip Header
    //-----------------------------------------

    for (let i = 1; i < vacancyTable.rows.length; i++) {

        const row = vacancyTable.rows[i];

        if (row.length < 3) continue;

        const postName = row[0].text.trim();

        const totalPosts = Number(
            row[1].text.replace(/\D/g, "")
        ) || 0;

        const qualification = row[2].text.trim();

        result.vacancies.push({

            postName,

            totalPosts,

            qualification

        });

        result.totalPosts += totalPosts;

    }

    //-----------------------------------------
    // Overall Qualification
    //-----------------------------------------

    const qualifications = [

        ...new Set(

            result.vacancies
                .map(v => v.qualification)
                .filter(Boolean)

        )

    ];

    result.qualification = qualifications.join(" | ");

    return result;

};