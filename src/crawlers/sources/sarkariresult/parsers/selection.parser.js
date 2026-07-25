function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = function parseSelection(text) {

    const result = {
        selectionProcess: []
    };

    if (!text) {
        return result;
    }

    //--------------------------------------
    // Extract "Mode of Selection" section
    //--------------------------------------

    const match = text.match(
        /Mode\s+of\s+Selection\s*([\s\S]*?)(?=SOME\s+USEFUL|Important\s+Links|Important\s+Question|FAQ|How\s+To\s+Fill|$)/i
    );

    if (match) {
        text = match[1];
    }

    //--------------------------------------
    // Normalize
    //--------------------------------------

    text = text
        .replace(/\r/g, " ")
        .replace(/\n/g, " ")
        .replace(/\t/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/[–—]/g, "-")
        .replace(/[|,>]/g, " ")
        .replace(/→/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    //--------------------------------------

    const steps = [
        {
            title: "Pre Examination",
            patterns: [
                "pre examination",
                "pre exam",
                "preliminary examination",
                "preliminary exam",
                "prelims"
            ]
        },
        {
            title: "Mains Examination",
            patterns: [
                "mains examination",
                "mains exam",
                "main examination",
                "main exam"
            ]
        },
        {
            title: "Computer Based Test",
            patterns: [
                "computer based test",
                "computer based examination",
                "cbt",
                "online examination",
                "online exam",
                "online test"
            ]
        },
        {
            title: "Written Exam",
            patterns: [
                "written exam",
                "written examination",
                "offline exam"
            ]
        },
        {
            title: "Tier I Exam",
            patterns: [
                "tier i",
                "tier-1",
                "tier 1"
            ]
        },
        {
            title: "Tier II Exam",
            patterns: [
                "tier ii",
                "tier-2",
                "tier 2"
            ]
        },
        {
            title: "Physical Efficiency Test",
            patterns: [
                "physical efficiency test",
                "pet"
            ]
        },
        {
            title: "Physical Standard Test",
            patterns: [
                "physical standard test",
                "pst"
            ]
        },
        {
            title: "Skill Test",
            patterns: [
                "skill test",
                "trade test",
                "practical test"
            ]
        },
        {
            title: "Typing Test",
            patterns: [
                "typing test"
            ]
        },
        {
            title: "Document Verification",
            patterns: [
                "document verification",
                "document check",
                "dv"
            ]
        },
        {
            title: "Medical Examination",
            patterns: [
                "medical examination",
                "medical test",
                "medical fitness"
            ]
        },
        {
            title: "Interview",
            patterns: [
                "interview",
                "personal interview",
                "viva"
            ]
        },
        {
            title: "Final Selection",
            patterns: [
                "final selection",
                "selection list"
            ]
        },
        {
            title: "Merit List",
            patterns: [
                "merit list",
                "final merit"
            ]
        }
    ];

    const added = new Set();

    let step = 1;

    for (const item of steps) {

        let found = false;

        for (const pattern of item.patterns) {

            const regex = new RegExp(
                "\\b" + escapeRegex(pattern) + "\\b",
                "i"
            );

            if (regex.test(text)) {
                found = true;
                break;
            }
        }

        if (!found || added.has(item.title)) {
            continue;
        }

        added.add(item.title);

        result.selectionProcess.push({
            step: step++,
            title: item.title,
            description: item.title
        });
    }

    return result;
};