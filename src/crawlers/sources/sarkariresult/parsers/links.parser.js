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

    //--------------------------------
    // Blocked Domains
    //--------------------------------

    const blockedDomains = [

        "sarkariresult.com",
        "sarkariresult.tools",
        "sarkariresultportal.com",

        "play.google.com",
        "itunes.apple.com",

        "t.me",
        "telegram.me",
        "telegram.org",

        "whatsapp.com",

        "youtube.com",
        "youtu.be",

        "facebook.com",

        "instagram.com",

        "twitter.com",

        "x.com",

        "tinyurl.com",

        "bit.ly",

        "goo.gl",

        "rb.gy"

    ];

    //--------------------------------
    // Blocked Words
    //--------------------------------

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

    //--------------------------------
    // Ignore useless titles
    //--------------------------------

    const ignoredTitles = [

        "click",

        "click here",

        "here",

        "link"

    ];

    //--------------------------------
    // Parse Tables
    //--------------------------------

    for (const table of detail.tables) {

        for (const row of table.rows) {

            for (const cell of row) {

                if (!cell.links || !cell.links.length) continue;

                for (const link of cell.links) {

                    let title = (link.text || "").trim();

                    const url = (link.href || "").trim();

                    if (!url) continue;

                    //--------------------------------
                    // Duplicate URL
                    //--------------------------------

                    if (added.has(url)) continue;

                    //--------------------------------
                    // Block Domains
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
                    // Block Titles
                    //--------------------------------

                    const lowerTitle = title.toLowerCase();

                    if (
                        blockedWords.some(word =>
                            lowerTitle.includes(word)
                        )
                    ) {
                        continue;
                    }

                    //--------------------------------
                    // Detect Type
                    //--------------------------------

                    let type = "other";

                    if (lowerTitle.includes("apply")) {

                        type = "apply";
                        result.applyLink = url;

                    }

                    else if (
                        lowerTitle.includes("notification")
                    ) {

                        type = "notification";
                        result.notificationPdf = url;

                    }

                    else if (
                        lowerTitle.includes("official")
                    ) {

                        type = "official";
                        result.officialWebsite = url;

                    }

                    else if (
                        lowerTitle.includes("result")
                    ) {

                        type = "result";
                        result.resultLink = url;

                    }

                    else if (
                        lowerTitle.includes("admit")
                    ) {

                        type = "admit_card";
                        result.admitCardLink = url;

                    }

                    else if (
                        lowerTitle.includes("answer")
                    ) {

                        type = "answer_key";
                        result.answerKeyLink = url;

                    }

                    else if (
                        lowerTitle.includes("syllabus")
                    ) {

                        type = "syllabus";
                        result.syllabusLink = url;

                    }

                    else if (
                        lowerTitle.includes("login")
                    ) {

                        type = "login";
                        result.loginLink = url;

                    }

                    //--------------------------------
                    // Skip useless Click Here links
                    //--------------------------------

                    if (
                        ignoredTitles.includes(lowerTitle) &&
                        type === "other"
                    ) {
                        continue;
                    }

                    //--------------------------------
                    // Rename titles
                    //--------------------------------

                    if (
                        ignoredTitles.includes(lowerTitle)
                    ) {

                        switch (type) {

                            case "apply":
                                title = "Apply Online";
                                break;

                            case "notification":
                                title = "Download Notification";
                                break;

                            case "official":
                                title = "Official Website";
                                break;

                            case "result":
                                title = "Download Result";
                                break;

                            case "admit_card":
                                title = "Download Admit Card";
                                break;

                            case "answer_key":
                                title = "Download Answer Key";
                                break;

                            case "syllabus":
                                title = "Download Syllabus";
                                break;

                            case "login":
                                title = "Candidate Login";
                                break;

                            default:
                                title = "Important Link";

                        }

                    }

                    //--------------------------------
                    // Skip unknown links
                    //--------------------------------

                    if (type === "other") {
                        continue;
                    }

                    //--------------------------------
                    // Add URL
                    //--------------------------------

                    added.add(url);

                    result.importantLinks.push({

                        title,

                        type,

                        url,

                        isPrimary:
                            type === "apply" ||
                            type === "official"

                    });

                }

            }

        }

    }

    return result;

};