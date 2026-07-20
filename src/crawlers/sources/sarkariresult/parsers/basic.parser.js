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
    // Read all text
    //--------------------------------

    for (const table of detail.tables) {

        for (const row of table.rows) {

            const text = row
                .map(cell => cell.text)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();

            if (!text) continue;

            paragraphs.push(text);

        }

    }

    //--------------------------------
    // Description
    //--------------------------------

    let description = paragraphs.join("\n");

    //--------------------------------
    // Remove Sarkari Result branding
    //--------------------------------

    description = description

        .replace(/Sarkari Result®/gi, "")

        .replace(/WWW\.SARKARIRESULT\.COM/gi, "")

        .replace(/SarkariResult\.com/gi, "")

        .replace(/Join Sarkari Result Channel[\s\S]*/gi, "")

        .replace(/Download Mobile Apps[\s\S]*/gi, "")

        .replace(/Android Apps?/gi, "")

        .replace(/Apple IOS Apps?/gi, "")

        .replace(/Remove Background/gi, "")

        .replace(/Sarkari Result Portal/gi, "")

        .replace(/Download Mobile App/gi, "")

        .replace(/\s+/g, " ")

        .trim();

    job.description = description;

    //--------------------------------
    // Short Description
    //--------------------------------

    job.shortDescription = description
        .split(". ")
        .slice(0, 3)
        .join(". ");

    //--------------------------------
    // Organization
    //--------------------------------

    job.organization = detectOrganization(
        detail.title,
        description
    );

    return job;

};

function detectOrganization(title, description) {

    const text = `${title} ${description}`;

    const patterns = [

        /\bUPPSC\b/i,

        /\bUPSC\b/i,

        /\bSSC\b/i,

        /\bMPESB\b/i,

        /\bBPSC\b/i,

        /\bRRB\b/i,

        /\bIBPS\b/i,

        /\bNTA\b/i,

        /\bBHU\b/i,

        /\bDSSSB\b/i,

        /\bBSF\b/i,

        /\bCRPF\b/i,

        /\bCISF\b/i,

        /\bITBP\b/i,

        /\bIndian Army\b/i,

        /\bIndian Navy\b/i,

        /\bIndian Air Force\b/i

    ];

    for (const pattern of patterns) {

        const match = text.match(pattern);

        if (match) {

            return match[0];

        }

    }

    return "";

}