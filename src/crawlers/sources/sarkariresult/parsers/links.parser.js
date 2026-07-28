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
        "sarkariresult.com.cm",
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

    //--------------------------------------------------
    // Parse only Important Links table
    //--------------------------------------------------

    for (const table of detail.tables) {

        const isImportantLinksTable = table.rows.some(row => {

            const title = (row[0]?.text || "").toLowerCase();

            return (
                /^apply/i.test(title) ||
                /^check/i.test(title) ||
                /official website/i.test(title) ||
                /official notification/i.test(title) ||
                /^result/i.test(title) ||
                /admit/i.test(title) ||
                /answer/i.test(title) ||
                /syllabus/i.test(title) ||
                /login/i.test(title)
            );

        });

        if (!isImportantLinksTable) {
            continue;
        }

        for (const row of table.rows) {

            const firstColumn = (row[0]?.text || "").trim();

            const rowTitle = firstColumn.toLowerCase();

            const validLinkRow =

                /^apply/i.test(firstColumn) ||
                /^check/i.test(firstColumn) ||
                /official website/i.test(firstColumn) ||
                /official notification/i.test(firstColumn) ||
                /^result/i.test(firstColumn) ||
                /admit/i.test(firstColumn) ||
                /answer/i.test(firstColumn) ||
                /syllabus/i.test(firstColumn) ||
                /login/i.test(firstColumn);

            if (!validLinkRow) {
                continue;
            }

            for (const cell of row) {

                if (!cell.links?.length)
                    continue;

                for (const link of cell.links) {

                    const url = (link.href || "").trim();

                    if (!url)
                        continue;

                    if (!/^https?:\/\//i.test(url))
                        continue;

                    if (added.has(url))
                        continue;

                    const lowerUrl = url.toLowerCase();

                    if (
                        blockedDomains.some(domain =>
                            lowerUrl.includes(domain)
                        )
                    ) {
                        continue;
                    }

                    let title = firstColumn || (link.text || "").trim();

                    if (
                        !title ||
                        ignoredTitles.includes(title.toLowerCase())
                    ) {
                        title = firstColumn;
                    }

                    if (
                        blockedWords.some(word =>
                            rowTitle.includes(word)
                        )
                    ) {
                        continue;
                    }

                    let type = "other";

                    //--------------------------------

                    if (
                        /^apply\s*online/i.test(firstColumn) ||
                        /^online\s*apply/i.test(firstColumn) ||
                        /^registration/i.test(firstColumn)
                    ) {

                        type = "apply";
                        result.applyLink = url;

                    }

                    else if (
                        /official notification|notification|advertisement|information bulletin|pdf/i.test(firstColumn)
                    ) {

                        type = "notification";
                        result.notificationPdf = url;

                    }

                    else if (
                        /official website|official portal|website|homepage/i.test(firstColumn)
                    ) {

                        type = "official";
                        result.officialWebsite = url;

                    }

                    else if (
                        /^result/i.test(firstColumn)
                    ) {

                        type = "result";
                        result.resultLink = url;

                    }

                    else if (
                        /admit/i.test(firstColumn)
                    ) {

                        type = "admit_card";
                        result.admitCardLink = url;

                    }

                    else if (
                        /answer/i.test(firstColumn)
                    ) {

                        type = "answer_key";
                        result.answerKeyLink = url;

                    }

                    else if (
                        /syllabus/i.test(firstColumn)
                    ) {

                        type = "syllabus";
                        result.syllabusLink = url;

                    }

                    else if (
                        /login/i.test(firstColumn)
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

    //------------------------------------------
    // Fallback
    //------------------------------------------

    if (!result.applyLink && result.officialWebsite) {
        result.applyLink = result.officialWebsite;
    }

    //------------------------------------------
    // Sort
    //------------------------------------------

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

};