module.exports = function parseAge(text) {

    const job = {

        minimumAge: null,

        maximumAge: null,

        ageRelaxations: []

    };

    if (!text) {
        return job;
    }

    //---------------------------------------
    // Minimum Age
    //---------------------------------------

    let match = text.match(/Minimum Age\s*:?\s*(\d+)/i);

    if (match) {
        job.minimumAge = Number(match[1]);
    }

    //---------------------------------------
    // Maximum Age
    //---------------------------------------

    match = text.match(/Maximum Age\s*:?\s*(\d+)/i);

    if (match) {
        job.maximumAge = Number(match[1]);
    }

    //---------------------------------------
    // Alternative Format
    //---------------------------------------

    if (!job.minimumAge || !job.maximumAge) {

        match = text.match(/(\d+)\s*Years?.*?(\d+)\s*Years?/is);

        if (match) {

            job.minimumAge = Number(match[1]);

            job.maximumAge = Number(match[2]);

        }

    }

    //---------------------------------------
    // Age Relaxation
    //---------------------------------------

    match = text.match(/Age Relaxation\s*(.*?)(?:Important|Vacancy|Selection|How to Fill|$)/is);

    if (match) {

        job.ageRelaxations.push({

            category: "General",

            relaxation: match[1]
                .replace(/\s+/g, " ")
                .trim()

        });

    } else {

        job.ageRelaxations.push({

            category: "General",

            relaxation: "As Per Government Rules"

        });

    }

    return job;

};