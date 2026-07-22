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

    if (!detail.tables?.length) {
        return result;
    }

    const added = new Set();

    const blockedDomains = [

        "sarkariresult.com",
        "sarkariresult.tools",
        "sarkariresultportal.com",

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

        "x.com",

        "bit.ly",
        "tinyurl.com",
        "goo.gl",
        "rb.gy"

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
        "photo resizer",
        "signature resizer",
        "remove background",
        "join channel",
        "mobile app",
        "pdf compress"

    ];

    const ignoredTitles = [

        "click",
        "click here",
        "here",
        "link"

    ];

    //-----------------------------------------
    // Parse every table
    //-----------------------------------------

    for (const table of detail.tables) {

        for (const row of table.rows) {

            const rowTitle = row
                .map(c => c.text || "")
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();

            for (const cell of row) {

                if (!cell.links?.length) continue;

                for (const link of cell.links) {

                    let title = (link.text || "").trim();

                    const url = (link.href || "").trim();

                    if (!url) continue;

                    if (!/^https?:\/\//i.test(url))
                        continue;

                    if (added.has(url))
                        continue;

                    const lowerUrl = url.toLowerCase();

                    if (
                        blockedDomains.some(x =>
                            lowerUrl.includes(x)
                        )
                    ) {
                        continue;
                    }

                    if (
                        !title ||
                        ignoredTitles.includes(title.toLowerCase())
                    ) {

                        title = rowTitle
                            .replace(/click here/ig, "")
                            .trim();

                    }

                    const lowerTitle =
                        title.toLowerCase();

                    if (
                        blockedWords.some(x =>
                            lowerTitle.includes(x)
                        )
                    ) {
                        continue;
                    }

                    let type = "other";

                    //--------------------------------

                    if (
                        lowerTitle.includes("apply") ||
                        lowerTitle.includes("registration") ||
                        lowerTitle.includes("online form")
                    ) {

                        type = "apply";
                        result.applyLink = url;

                    }

                    else if (

                        lowerTitle.includes("notification") ||
                        lowerTitle.includes("advertisement") ||
                        lowerTitle.includes("information bulletin") ||
                        lowerTitle.includes("pdf")

                    ) {

                        type = "notification";
                        result.notificationPdf = url;

                    }

                    else if (

                        lowerTitle.includes("official") ||
                        lowerTitle.includes("website") ||
                        lowerTitle.includes("portal") ||
                        lowerTitle.includes("homepage")

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

                    if (type === "other")
                        continue;

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

    //-----------------------------------------
    // Sort Links
    //-----------------------------------------

    const order = {

        apply: 1,

        notification: 2,

        official: 3,

        result: 4,

        admit_card: 5,

        answer_key: 6,

        syllabus: 7,

        login: 8

    };

    result.importantLinks.sort(

        (a, b) =>

            (order[a.type] || 99) -
            (order[b.type] || 99)

    );

    return result;

}