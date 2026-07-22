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
    // Normalize
    //--------------------------------------

    text = text
        .replace(/\r/g, " ")
        .replace(/\n/g, " ")
        .replace(/\t/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    //--------------------------------------
    // Supported Selection Steps
    //--------------------------------------

    const steps = [

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
                "typing test",
                "typing speed"
            ]
        },

        {
            title: "SSB Interview",
            patterns: [
                "ssb interview",
                "services selection board"
            ]
        },

        {
            title: "Interview",
            patterns: [
                "interview",
                "personal interview",
                "viva"
            ],
            exclude: [
                "ssb interview"
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
            title: "Merit List",
            patterns: [
                "merit list",
                "final merit"
            ]
        }

    ];

    //--------------------------------------
    // Detect
    //--------------------------------------

    let step = 1;

    const added = new Set();

    for (const item of steps) {

        const found = item.patterns.some(pattern => {

            const regex = new RegExp(
                `\\b${escapeRegex(pattern)}\\b`,
                "i"
            );
        
            if (!regex.test(text)) {
                return false;
            }
        
            if (item.exclude) {
        
                for (const ex of item.exclude) {
        
                    const exRegex = new RegExp(
                        `\\b${escapeRegex(ex)}\\b`,
                        "i"
                    );
        
                    if (exRegex.test(text)) {
                        return false;
                    }
        
                }
        
            }
        
            return true;
        
        });

        if (!found) {
            continue;
        }

        if (added.has(item.title)) {
            continue;
        }

        added.add(item.title);

        result.selectionProcess.push({

            step: step++,

            title: item.title,

            description: item.title

        });

    }

    //--------------------------------------
    // Fallback
    //--------------------------------------

    if (!result.selectionProcess.length) {

        if (text.includes("selection")) {

            result.selectionProcess.push({

                step: 1,

                title: "As Per Official Notification",

                description: "Refer Official Notification"

            });

        }

    }

    return result;

};