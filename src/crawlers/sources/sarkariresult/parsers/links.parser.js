module.exports = function parseLinks(detail) {

    const result = {

        importantLinks: [],

        applyLink: "",

        notificationPdf: "",

        officialWebsite: "",

        resultLink: "",

        admitCardLink: "",

        answerKeyLink: "",

        syllabusLink: "",

        loginLink: ""

    };

    const added = new Set();

    const blockedDomains = [

        "sarkariresult.com",
        "sarkariresult.tools",
        "play.google.com",
        "itunes.apple.com",
        "t.me",
        "telegram.me",
        "whatsapp.com",
        "youtube.com",
        "youtu.be",
        "facebook.com",
        "instagram.com",
        "twitter.com",
        "x.com"

    ];

    const blockedWords = [

        "telegram",
        "whatsapp",
        "android",
        "apple",
        "ios",
        "facebook",
        "instagram",
        "twitter",
        "youtube",
        "tools",
        "age calculator",
        "pdf compress",
        "signature resizer",
        "remove background",
        "photo resizer",
        "join channel",
        "mobile app"

    ];

    for (const table of detail.tables) {

        for (const row of table.rows) {

            for (const cell of row) {

                if (!cell.links || !cell.links.length) continue;

                for (const link of cell.links) {

                    const title = (link.text || "").trim();
                    const url = (link.href || "").trim();

                    if (!url) continue;

                    //--------------------------------
                    // Skip duplicate URLs
                    //--------------------------------

                    if (added.has(url)) {
                        continue;
                    }

                    //--------------------------------
                    // Skip Sarkari Result & Social Links
                    //--------------------------------

                    const lowerUrl = url.toLowerCase();

                    if (
                        blockedDomains.some(domain =>
                            lowerUrl.includes(domain)
                        )
                    ) {
                        continue;
                    }

                    //--------------------------------
                    // Skip unwanted titles
                    //--------------------------------

                    const lowerTitle = title.toLowerCase();

                    if (
                        blockedWords.some(word =>
                            lowerTitle.includes(word)
                        )
                    ) {
                        continue;
                    }

                    added.add(url);

                    let type = "other";

                    if (lowerTitle.includes("apply")) {

                        type = "apply";
                        result.applyLink = url;

                    }

                    else if (lowerTitle.includes("notification")) {

                        type = "notification";
                        result.notificationPdf = url;

                    }

                    else if (
                        lowerTitle.includes("official website") ||
                        lowerTitle === "official website" ||
                        lowerTitle.includes("official")
                    ) {

                        type = "official";
                        result.officialWebsite = url;

                    }

                    else if (lowerTitle.includes("result")) {

                        type = "result";
                        result.resultLink = url;

                    }

                    else if (lowerTitle.includes("admit")) {

                        type = "admit_card";
                        result.admitCardLink = url;

                    }

                    else if (lowerTitle.includes("answer")) {

                        type = "answer_key";
                        result.answerKeyLink = url;

                    }

                    else if (lowerTitle.includes("syllabus")) {

                        type = "syllabus";
                        result.syllabusLink = url;

                    }

                    else if (lowerTitle.includes("login")) {

                        type = "login";
                        result.loginLink = url;

                    }

                    result.importantLinks.push({

                        title,

                        type,

                        url,

                        isPrimary: type === "apply"

                    });

                }

            }

        }

    }

    return result;

};