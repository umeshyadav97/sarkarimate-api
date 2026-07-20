function cleanOrganization(name = "") {

    const patterns = [
        /Recruitment.*/i,
        /Online Form.*/i,
        /Result.*/i,
        /Answer Key.*/i,
        /Admit Card.*/i,
        /Exam.*/i,
        /\d{4}.*/i,
    ];

    let org = name;

    patterns.forEach((pattern) => {
        org = org.replace(pattern, "");
    });

    return org.trim();
}

module.exports = cleanOrganization;