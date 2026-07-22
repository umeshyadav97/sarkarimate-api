module.exports = function parseBasic(detail) {

    const job = {

        title: detail.title,

        sourceUrl: detail.url,

        displaySection: detail.section,

        organization: "",

        description: "",

        shortDescription: ""

    };

    const paragraphs = [];

    //--------------------------------
    // Read all tables
    //--------------------------------

    for (const table of detail.tables || []) {

        for (const row of table.rows || []) {

            const text = row
                .map(cell => cell.text)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();

            if (text) {
                paragraphs.push(text);
            }

        }

    }

    //--------------------------------
    // Description
    //--------------------------------

    let description = paragraphs.join("\n");

    description = description

        .replace(/Latest Posts[\s\S]*/i, "")
        .replace(/Related Posts[\s\S]*/i, "")
        .replace(/Join Our WhatsApp Channel[\s\S]*/i, "")
        .replace(/Join Our Telegram Channel[\s\S]*/i, "")
        .replace(/Sarkari Result®?/gi, "")
        .replace(/WWW\.SARKARIRESULT\.COM/gi, "")
        .replace(/SarkariResult\.com/gi, "")
        .replace(/\s+/g, " ")
        .trim();

    job.description = description;

    job.shortDescription = description
        .substring(0, 250);

    //--------------------------------
    // Organization
    //--------------------------------

    job.organization = detectOrganization(detail.title);

    return job;
};

function detectOrganization(title = "") {

    if (!title) return "";

    const patterns = [

        { regex: /\bState Health Society Bihar\b/i, name: "State Health Society Bihar" },
        { regex: /\bBihar SHS\b/i, name: "Bihar SHS" },

        { regex: /\bIndian Navy\b/i, name: "Indian Navy" },
        { regex: /\bIndian Army\b/i, name: "Indian Army" },
        { regex: /\bIndian Air Force\b/i, name: "Indian Air Force" },

        { regex: /\bRailway Recruitment Board\b/i, name: "RRB" },

        { regex: /\bUPSC\b/i, name: "UPSC" },
        { regex: /\bUPPSC\b/i, name: "UPPSC" },
        { regex: /\bBPSC\b/i, name: "BPSC" },
        { regex: /\bSSC\b/i, name: "SSC" },
        { regex: /\bIBPS\b/i, name: "IBPS" },
        { regex: /\bNTA\b/i, name: "NTA" },
        { regex: /\bAIIMS\b/i, name: "AIIMS" },
        { regex: /\bRRB\b/i, name: "RRB" },
        { regex: /\bRBI\b/i, name: "RBI" },
        { regex: /\bLIC\b/i, name: "LIC" },
        { regex: /\bBSF\b/i, name: "BSF" },
        { regex: /\bCRPF\b/i, name: "CRPF" },
        { regex: /\bCISF\b/i, name: "CISF" },
        { regex: /\bITBP\b/i, name: "ITBP" },
        { regex: /\bDSSSB\b/i, name: "DSSSB" },
        { regex: /\bMPESB\b/i, name: "MPESB" },
        { regex: /\bBHU\b/i, name: "BHU" },
        { regex: /\bRRVUNL\b/i, name: "RRVUNL" }

    ];

    for (const pattern of patterns) {

        if (pattern.regex.test(title)) {
            return pattern.name;
        }

    }

    // Fallback:
    const words = title.split(/\s+/);

    return words.slice(0, 2).join(" ");
}