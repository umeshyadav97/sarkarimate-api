module.exports = function parseSections(detail) {

    const text = (detail.description || "")
        .replace(/\s+/g, " ")
        .trim();

    const sectionConfig = [
        {
            key: "dates",
            patterns: [
                "Important Dates",
                "Important Date"
            ]
        },
        {
            key: "fee",
            patterns: [
                "Application Fee",
                "Application Fees",
                "Fee Details"
            ]
        },
        {
            key: "age",
            patterns: [
                "Age Limit",
                "Age Limits",
                "Age Criteria"
            ]
        },
        {
            key: "vacancy",
            patterns: [
                "Vacancy Details",
                "Post Details",
                "Vacancy Detail"
            ]
        },
        {
            key: "selection",
            patterns: [
                "Selection Process",
                "Mode Of Selection",
                "Selection Procedure"
            ]
        },
        {
            key: "salary",
            patterns: [
                "Pay Scale",
                "Salary Details",
                "Salary",
                "Pay Level"
            ]
        },
        {
            key: "links",
            patterns: [
                "Some Useful Important Links",
                "Important Links",
                "Useful Important Links"
            ]
        }
    ];

    const positions = [];

    for (const section of sectionConfig) {

        let start = -1;

        for (const pattern of section.patterns) {

            const index = text.indexOf(pattern);

            if (index !== -1) {

                if (start === -1 || index < start) {
                    start = index;
                }

            }

        }

        if (start !== -1) {

            positions.push({
                key: section.key,
                start
            });

        }

    }

    positions.sort((a, b) => a.start - b.start);

    const result = {};

    for (const section of sectionConfig) {
        result[section.key] = "";
    }

    for (let i = 0; i < positions.length; i++) {

        const current = positions[i];

        const end =
            i + 1 < positions.length
                ? positions[i + 1].start
                : text.length;

        result[current.key] = text
            .substring(current.start, end)
            .trim();

    }

    return result;

};