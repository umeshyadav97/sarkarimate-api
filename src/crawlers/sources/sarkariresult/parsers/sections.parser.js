module.exports = function parseSections(detail) {

    const text = (detail.description || "")
        .replace(/\s+/g, " ")
        .trim();

    const result = {};

    const sections = [

        {
            key: "dates",
            heading: "Important Dates"
        },

        {
            key: "fee",
            heading: "Application Fee"
        },

        {
            key: "age",
            heading: "Age Limit"
        },

        {
            key: "vacancy",
            heading: "Vacancy Details"
        },

        {
            key: "selection",
            heading: "Selection Process"
        },

        {
            key: "salary",
            heading: "Pay Scale"
        },

        {
            key: "links",
            heading: "Some Useful Important Links"
        }

    ];

    for (let i = 0; i < sections.length; i++) {

        const current = sections[i];

        const start = text.indexOf(current.heading);

        if (start === -1) {

            result[current.key] = "";

            continue;

        }

        let end = text.length;

        for (let j = i + 1; j < sections.length; j++) {

            const next = text.indexOf(
                sections[j].heading,
                start + current.heading.length
            );

            if (next !== -1) {

                end = next;

                break;

            }

        }

        result[current.key] = text
            .substring(start, end)
            .trim();

    }

    return result;

};