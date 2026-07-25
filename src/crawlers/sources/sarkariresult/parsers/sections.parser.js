module.exports = function parseSections(detail) {

    const text = (detail.description || "")
        .replace(/\s+/g, " ")
        .trim();

    const lowerText = text.toLowerCase();

    const sectionConfig = [
        {
            key: "dates",
            patterns: [
                "important dates",
                "important date"
            ]
        },
        {
            key: "fee",
            patterns: [
                "application fee",
                "application fees",
                "fee details"
            ]
        },
        {
            key: "age",
            patterns: [
                "age limit",
                "age limits",
                "age criteria"
            ]
        },
        {
            key: "vacancy",
            patterns: [
                "vacancy details",
                "post details",
                "vacancy detail"
            ]
        },
        {
            key: "selection",
            patterns: [
                "mode of selection",
                "selection process",
                "selection procedure"
            ]
        },
        {
            key: "salary",
            patterns: [
                "pay scale",
                "salary details",
                "salary",
                "pay level"
            ]
        },
        {
            key: "links",
            patterns: [
                "some useful important links",
                "important links",
                "useful important links"
            ]
        }
    ];

    const positions = [];

    for (const section of sectionConfig) {

        let start = -1;

        for (const pattern of section.patterns) {

            const index = lowerText.indexOf(pattern.toLowerCase());

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