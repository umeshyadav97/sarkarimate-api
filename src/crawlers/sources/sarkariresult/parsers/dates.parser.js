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
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    //---------------------------------------
    // Clean helper
    //---------------------------------------

    function clean(value = "") {

        return value
            .replace(/\s+/g, " ")
            .replace(/^:+/, "")
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

        /Online Apply Start Date\s*:\s*(.*?)(?=\s*(Online Apply Last Date|Apply Last Date|Last Date|Last Date For Fee Payment|Exam Date|Admit Card|Result Date|$))/i,

        /Apply Start Date\s*:\s*(.*?)(?=\s*(Last Date|$))/i,

        /Application Begin\s*:\s*(.*?)(?=\s*(Last Date|$))/i,

        /Registration Start\s*:\s*(.*?)(?=\s*(Last Date|$))/i

    );

    //---------------------------------------
    // Last Date
    //---------------------------------------

    result.lastDate = extract(

        /Online Apply Last Date\s*:\s*(.*?)(?=\s*(Last Date For Fee Payment|Pay Exam Fee|Correction|Exam Date|Admit Card|Answer Key|Result Date|$))/i,

        /Apply Last Date\s*:\s*(.*?)(?=\s*(Last Date For Fee Payment|Pay Exam Fee|Correction|Exam Date|Admit Card|Answer Key|Result Date|$))/i,

        /Last Date\s*:\s*(.*?)(?=\s*(Last Date For Fee Payment|Pay Exam Fee|Correction|Exam Date|Admit Card|Answer Key|Result Date|$))/i,

        /Closing Date\s*:\s*(.*?)(?=\s*(Exam Date|Admit Card|Result Date|$))/i

    );

    //---------------------------------------
    // Fee Payment
    //---------------------------------------

    result.lastDatePayFee = extract(

        /Last Date For Fee Payment\s*:\s*(.*?)(?=\s*(Correction|Exam Date|Admit Card|Answer Key|Result Date|Candidates are advised|$))/i,

        /Pay Exam Fee Last Date\s*:\s*(.*?)(?=\s*(Correction|Exam Date|Admit Card|Answer Key|Result Date|$))/i,

        /Fee Payment Last Date\s*:\s*(.*?)(?=\s*(Correction|Exam Date|Admit Card|Answer Key|Result Date|$))/i

    );

    //---------------------------------------
    // Correction
    //---------------------------------------

    result.correctionLastDate = extract(

        /Correction(?: Last)? Date\s*:\s*(.*?)(?=\s*(Exam Date|Admit Card|Answer Key|Result Date|$))/i

    );

    //---------------------------------------
    // Exam Date
    //---------------------------------------

    result.examDate = extract(

        /Exam Date\s*:\s*(.*?)(?=\s*(Admit Card|Answer Key|Result Date|Candidates are advised|$))/i

    );

    //---------------------------------------
    // Admit Card
    //---------------------------------------

    result.admitCardDate = extract(

        /Admit Card\s*:\s*(.*?)(?=\s*(Answer Key|Result Date|Candidates are advised|$))/i

    );

    //---------------------------------------
    // Answer Key
    //---------------------------------------

    result.answerKeyDate = extract(

        /Answer Key\s*:\s*(.*?)(?=\s*(Result Date|Candidates are advised|$))/i

    );

    //---------------------------------------
    // Result Date
    //---------------------------------------

    result.resultDate = extract(

        /Result Date\s*:\s*(.*?)(?=\s*(Candidates are advised|Official Website|Application Fee|Age Limit|Total Post|$))/i

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