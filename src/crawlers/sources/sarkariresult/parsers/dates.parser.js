module.exports = function parseDates(text) {

    const result = {
        applicationStartDate: "",
        lastDate: "",
        lastDatePayFee: "",
        correctionLastDate: "",
        examDate: "",
        admitCardDate: "",
        answerKeyDate: "",
        resultDate: "",
        importantDates: []
    };

    if (!text) {
        return result;
    }

    //---------------------------------------
    // Normalize
    //---------------------------------------

    text = text
        .replace(/\r/g, "\n")
        .replace(/\t/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    //---------------------------------------
    // Next field detector
    //---------------------------------------

    const NEXT_FIELD =
    "(?=\\s*(?:Application Start Date|Online Apply Start Date|Registration Start|Application Begin|Registration Last Date|Online Apply Last Date|Apply Last Date|Last Date|Last Date For Fee Payment|Pay Exam Fee Last Date|Fee Payment Last Date|Correction(?: Last)? Date|Pre Exam Date|Mains Exam Date|Exam Date|Pre Exam Admit Card|Mains Admit Card|Main Exam Admit Card|Admit Card|Hall Ticket|Call Letter|Answer Key|Result(?: Date)?|Interview Date|Document Verification|Joining Date|Candidates are advised|Application Fee|No application fee|Age Limit|Total Post|Important Links|Official Website|$))";
    //---------------------------------------
    // Clean helper
    //---------------------------------------

    function clean(value = "") {

        return value
            .replace(/\s+/g, " ")
            .replace(/^:+/, "")
            .replace(/^Available\s*:\s*/i, "")
            .replace(/^Declared\s*:\s*/i, "")
            .trim();

    }

    //---------------------------------------
    // Extract helper
    //---------------------------------------

    function extract(...patterns) {

        for (const regex of patterns) {

            const match = text.match(regex);

            if (match) {
                return clean(match[1]);
            }

        }

        return "";

    }

    //---------------------------------------
    // Application Start
    //---------------------------------------

    result.applicationStartDate = extract(

        new RegExp(`Online Apply Start Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Application Start Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Registration Start\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Application Begin\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i")

    );

    //---------------------------------------
    // Last Date
    //---------------------------------------

    result.lastDate = extract(

        new RegExp(`Registration Last Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Online Apply Last Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Apply Last Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Last Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i")

    );

    //---------------------------------------
    // Fee Payment
    //---------------------------------------

    result.lastDatePayFee = extract(

        new RegExp(`Last Date For Fee Payment\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Pay Exam Fee Last Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Fee Payment Last Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i")

    );

    //---------------------------------------
    // Correction
    //---------------------------------------

    result.correctionLastDate = extract(

        new RegExp(`Correction(?: Last)? Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i")

    );

    //---------------------------------------
    // Exam Date
    //---------------------------------------

    result.examDate = extract(

        new RegExp(`Pre Exam Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Mains Exam Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Exam Date\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i")

    );

    //---------------------------------------
    // Admit Card
    //---------------------------------------

    result.admitCardDate = extract(

        new RegExp(`Pre Exam Admit Card\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Mains Admit Card\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Main Exam Admit Card\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Admit Card\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Hall Ticket\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i"),

        new RegExp(`Call Letter\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i")

    );

    //---------------------------------------
    // Answer Key
    //---------------------------------------

    result.answerKeyDate = extract(

        new RegExp(`Answer Key\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i")

    );

    //---------------------------------------
    // Result
    //---------------------------------------

    result.resultDate = extract(

        new RegExp(`Result(?: Date)?\\s*:?\\s*(.*?)${NEXT_FIELD}`, "i")

    );

    //---------------------------------------
    // Timeline
    //---------------------------------------

    const fields = [

        ["Application Start", result.applicationStartDate],

        ["Last Date", result.lastDate],

        ["Pay Exam Fee", result.lastDatePayFee],

        ["Correction", result.correctionLastDate],

        ["Exam Date", result.examDate],

        ["Admit Card", result.admitCardDate],

        ["Answer Key", result.answerKeyDate],

        ["Result", result.resultDate]

    ];

    for (const [title, value] of fields) {

        if (value) {

            result.importantDates.push({
                title,
                value
            });

        }

    }

    return result;

};
