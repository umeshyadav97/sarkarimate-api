module.exports = function shouldImport(job) {

    const text = [
        job.title,
        job.organization,
        job.shortDescription
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    const currentYear = new Date().getFullYear();

    const allowedYears = [
        String(currentYear),
        String(currentYear - 1)
    ];

    const hasYear = allowedYears.some(year =>
        text.includes(year)
    );

    const allowedSections = [
        "latest_job",
        "admit_card",
        "result",
        "answer_key"
    ];

    const hasSection = allowedSections.includes(job.displaySection);

    return hasYear && hasSection;
};