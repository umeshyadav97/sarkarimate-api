module.exports = function parseAge(text) {

    const result = {

        minimumAge: null,

        maximumAge: null,

        ageAsOn: "",

        ageRelaxations: [],

        birthDateFrom: "",

        birthDateTo: ""

    };

    if (!text) {
        return result;
    }

    //------------------------------------
    // Normalize
    //------------------------------------

    text = text
        .replace(/\r/g, "\n")
        .replace(/\t/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    //------------------------------------
    // Minimum Age
    //------------------------------------

    let match = text.match(
        /Minimum Age\s*:?\s*(\d+)/i
    );

    if (match) {

        result.minimumAge = Number(match[1]);

    }

    //------------------------------------
    // Maximum Age
    //------------------------------------

    match = text.match(
        /Maximum Age\s*:?\s*(\d+)/i
    );

    if (match) {

        result.maximumAge = Number(match[1]);

    }

    //------------------------------------
    // Age Range
    //------------------------------------

    if (
        result.minimumAge === null ||
        result.maximumAge === null
    ) {

        match = text.match(
            /(\d+)\s*(?:-|to)\s*(\d+)\s*Years?/i
        );

        if (match) {

            result.minimumAge = Number(match[1]);

            result.maximumAge = Number(match[2]);

        }

    }

    //------------------------------------
    // Not Exceeding
    //------------------------------------

    if (result.maximumAge === null) {

        match = text.match(
            /Not Exceeding\s*(\d+)/i
        );

        if (match) {

            result.maximumAge = Number(match[1]);

        }

    }

    //------------------------------------
    // Birth Date Range
    //------------------------------------

    match = text.match(
        /born\s+between\s+(\d{2}\s+[A-Za-z]+\s+\d{4})\s+and\s+(\d{2}\s+[A-Za-z]+\s+\d{4})/i
    );

    if (!match) {

        match = text.match(
            /(\d{2}[\/.-]\d{2}[\/.-]\d{4})\s*(?:to|-|and)\s*(\d{2}[\/.-]\d{2}[\/.-]\d{4})/i
        );

    }

    if (match) {

        result.birthDateFrom = match[1];

        result.birthDateTo = match[2];

    }

    //------------------------------------
    // Age As On
    //------------------------------------

    match = text.match(
        /Age(?: Limit)? As On\s*:?\s*([0-9\/.-]+)/i
    );

    if (match) {

        result.ageAsOn = match[1];

    }
    else if (/As On Indian Navy Rules/i.test(text)) {

        result.ageAsOn = "Indian Navy Rules";

    }
    else if (/As On Railway Rules/i.test(text)) {

        result.ageAsOn = "Railway Rules";

    }
    else if (/As On UPSC Rules/i.test(text)) {

        result.ageAsOn = "UPSC Rules";

    }
    else if (/As On Government Rules/i.test(text)) {

        result.ageAsOn = "Government Rules";

    }

    //------------------------------------
    // Relaxations
    //------------------------------------

    const categories = [

        "SC/ST",

        "SC",

        "ST",

        "OBC",

        "EWS",

        "PwBD",

        "PH",

        "Ex-Servicemen"

    ];

    for (const category of categories) {

        const regex = new RegExp(
            category.replace("/", "\\/") +
            ".*?(\\d+\\s*Years?)",
            "i"
        );

        const match = text.match(regex);

        if (match) {

            result.ageRelaxations.push({

                category,

                relaxation: match[1]

            });

        }

    }

    //------------------------------------
    // Default Relaxation
    //------------------------------------

    if (!result.ageRelaxations.length) {

        result.ageRelaxations.push({

            category: "General",

            relaxation: "As Per Government Rules"

        });

    }

    return result;

};