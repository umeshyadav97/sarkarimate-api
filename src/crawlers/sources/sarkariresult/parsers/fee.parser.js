module.exports = function parseFee(text) {

    const result = {
        applicationFees: [],
        applicationMode: "Online",
        isFree: false
    };

    if (!text) {
        return result;
    }

    //-----------------------------------------
    // Normalize
    //-----------------------------------------

    text = text
        .replace(/\r/g, "\n")
        .replace(/\t/g, " ")
        .replace(/\u00A0/g, " ");

    //-----------------------------------------
    // Keep only Fee section
    //-----------------------------------------

    const feeMatch = text.match(
        /Application Fee([\s\S]*?)(?=Age Limit|Important Dates|Vacancy Details|How To Fill|Mode Of Selection|$)/i
    );

    if (feeMatch) {
        text = feeMatch[1];
    }

    //-----------------------------------------
    // Free Application
    //-----------------------------------------

    if (
        /no\s+application\s+fee/i.test(text) ||
        /no\s+fee\s+is\s+required/i.test(text) ||
        /application\s+fee\s*:\s*nil/i.test(text) ||
        /application\s+fee\s*:\s*free/i.test(text) ||
        /free\s+for\s+all\s+candidates/i.test(text)
    ) {

        result.applicationFees.push({
            category: "All Candidates",
            fee: "0"
        });

        result.isFree = true;

        return result;
    }

    //-----------------------------------------
    // Parse line by line
    //-----------------------------------------

    const lines = text
        .split(/\n/)
        .map(x => x.trim())
        .filter(Boolean);

    const added = new Set();

    for (const line of lines) {

        if (/payment mode/i.test(line)) continue;

        const match = line.match(
            /(General|UR|OBC|EWS|SC|ST|Female|Women|PwBD|PWD|PH|Ex-Servicemen|All Candidates)(.*?)(₹|Rs\.?)?\s*(Nil|NIL|Free|\d+)/i
        );

        if (!match) continue;

        let category = match[1].trim();

        let fee = match[4];

        if (/nil|free/i.test(fee)) {
            fee = "0";
        }

        if (added.has(category.toLowerCase())) {
            continue;
        }

        added.add(category.toLowerCase());

        result.applicationFees.push({
            category,
            fee
        });

    }

    //-----------------------------------------
    // Nothing parsed
    //-----------------------------------------

    if (!result.applicationFees.length) {

        const singleFee = text.match(
            /(₹|Rs\.?)\s*(\d+)/
        );

        if (singleFee) {

            result.applicationFees.push({
                category: "All Candidates",
                fee: singleFee[2]
            });

        }

    }

    //-----------------------------------------
    // Free?
    //-----------------------------------------

    if (
        result.applicationFees.length &&
        result.applicationFees.every(
            x => Number(x.fee) === 0
        )
    ) {
        result.isFree = true;
    }

    //-----------------------------------------
    // Offline
    //-----------------------------------------

    if (/offline/i.test(text)) {
        result.applicationMode = "Offline";
    }

    return result;

};