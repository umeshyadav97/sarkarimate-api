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

    //------------------------------------
    // Clean text
    //------------------------------------

    text = text
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .replace(/\s+/g, " ");

    //------------------------------------
    // Helper
    //------------------------------------

    function extract(label) {

        const regex = new RegExp(
            label + "\\s*:?\\s*(.*?)(?=(Application Begin|Last Date|Pay Exam Fee|Correction|Exam Date|Admit Card|Answer Key|Result|$))",
            "i"
        );

        const match = text.match(regex);

        return match ? match[1].trim() : "";

    }

    //------------------------------------
    // Dates
    //------------------------------------

    result.applicationStartDate = extract("Application Begin");

    result.lastDate = extract("Last Date(?: for Apply Online)?");

    result.lastDatePayFee = extract("Pay Exam Fee(?: Last Date)?");

    result.correctionLastDate = extract("Correction(?: Last Date)?");

    result.examDate = extract("Exam Date");

    result.admitCardDate = extract("Admit Card Available");

    result.answerKeyDate = extract("Answer Key Available");

    result.resultDate = extract("Result");

    //------------------------------------
    // Timeline
    //------------------------------------

    if (result.applicationStartDate) {

        result.importantDates.push({

            title: "Application Start",

            value: result.applicationStartDate

        });

    }

    if (result.lastDate) {

        result.importantDates.push({

            title: "Last Date",

            value: result.lastDate

        });

    }

    if (result.examDate) {

        result.importantDates.push({

            title: "Exam Date",

            value: result.examDate

        });

    }

    if (result.admitCardDate) {

        result.importantDates.push({

            title: "Admit Card",

            value: result.admitCardDate

        });

    }

    if (result.answerKeyDate) {

        result.importantDates.push({

            title: "Answer Key",

            value: result.answerKeyDate

        });

    }

    if (result.resultDate) {

        result.importantDates.push({

            title: "Result",

            value: result.resultDate

        });

    }

    return result;

};