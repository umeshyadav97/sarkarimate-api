module.exports = function parseTableVacancies(detail) {

    const best = {
        totalPosts: 0,
        qualification: "",
        vacancies: []
    };

    if (!detail.tables?.length) {
        return best;
    }

    for (const table of detail.tables) {

        if (!table.rows?.length) continue;

        const rows = table.rows.map(row =>
            row.map(cell => (cell.text || "").trim())
        );

        //--------------------------------------
        // Find Header
        //--------------------------------------

        let headerIndex = -1;

        for (let i = 0; i < rows.length; i++) {

            const line = rows[i].join(" ").toLowerCase();

            if (
                line.includes("post name") &&
                line.includes("total post")
            ) {
                headerIndex = i;
                break;
            }
        }

        if (headerIndex === -1) {
            continue;
        }

        console.log("✅ Vacancy table found");

        //--------------------------------------
        // Parse Current Table
        //--------------------------------------

        const current = {
            totalPosts: 0,
            qualification: "",
            vacancies: []
        };

        for (let i = headerIndex + 1; i < rows.length; i++) {

            const row = rows[i];

            if (row.length < 3) {
                break;
            }

            const postName = row[0].trim();

            if (
                !postName ||
                /how to fill/i.test(postName) ||
                /important links/i.test(postName) ||
                /official website/i.test(postName) ||
                /category wise/i.test(postName) ||
                /physical/i.test(postName) ||
                /selection/i.test(postName) ||
                /exam pattern/i.test(postName)
            ) {
                break;
            }

            const totalPosts =
                Number((row[1] || "").replace(/\D/g, "")) || 0;

            // Ignore category-wise vacancy tables
            if (
                row.length > 5 &&
                totalPosts < 50
            ) {
                continue;
            }

            const qualification = row
                .slice(2)
                .join(" ")
                .trim();

            current.vacancies.push({
                postName,
                totalPosts,
                qualification
            });

            current.totalPosts += totalPosts;
        }

        current.qualification = [
            ...new Set(
                current.vacancies
                    .map(v => v.qualification)
                    .filter(Boolean)
            )
        ].join(" | ");

        //--------------------------------------
        // Keep Best Table
        //--------------------------------------

        if (
            current.vacancies.length >
            best.vacancies.length
        ) {
            best.totalPosts = current.totalPosts;
            best.qualification = current.qualification;
            best.vacancies = current.vacancies;
        }
    }

    console.log("=================================");
    console.log("JOB AFTER MAPPING");
    console.log("totalPosts:", best.totalPosts);
    console.log("qualification:", best.qualification);
    console.log("vacancies:", best.vacancies.length);
    console.log(JSON.stringify(best.vacancies, null, 2));
    console.log("=================================");

    return best;
};