const MONTHS = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
};

module.exports = function parseLastDate(lastDate = "") {

    if (!lastDate) return null;

    lastDate = lastDate
        .replace(/\(.*?\)/g, "")                  // Remove (Extended)
        .replace(/Fee Payment.*$/i, "")          // Remove Fee Payment text
        .replace(/Last Date\s*:?\s*/i, "")       // Remove "Last Date :"
        .trim();

    // Ignore non-date values
    if (
        /available soon|notify soon|as per scheduled/i.test(lastDate)
    ) {
        return null;
    }

    // Match: 30 August 2026
    let match = lastDate.match(
        /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/
    );

    if (match) {

        const month = MONTHS[match[2].toLowerCase()];

        if (month !== undefined) {
            return new Date(
                Number(match[3]),
                month,
                Number(match[1])
            );
        }
    }

    // Match: March 2026
    match = lastDate.match(
        /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i
    );

    if (match) {

        return new Date(
            Number(match[2]),
            MONTHS[match[1].toLowerCase()],
            1
        );
    }

    return null;
};