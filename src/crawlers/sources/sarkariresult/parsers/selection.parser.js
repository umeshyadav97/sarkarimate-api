module.exports = function parseSelection(text) {

    const job = {
        selectionProcess: []
    };

    if (!text) {
        return job;
    }

    const steps = [
        "Written Exam",
        "Computer Based Test",
        "CBT",
        "PET",
        "PST",
        "Skill Test",
        "Typing Test",
        "Interview",
        "Medical Examination",
        "Medical Test",
        "Document Verification",
        "DV",
        "Merit List"
    ];

    let step = 1;

    steps.forEach(title => {

        const regex = new RegExp(`\\b${title}\\b`, "i");

        if (regex.test(text)) {

            job.selectionProcess.push({

                step: step++,

                title,

                description: title

            });

        }

    });

    return job;

};