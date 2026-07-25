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
        .replace(/\r/g, " ")
        .replace(/\n/g, " ")
        .replace(/\t/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    //-----------------------------------------
    // Keep Fee Section
    //-----------------------------------------

    const feeMatch = text.match(
        /Application Fee([\s\S]*?)(?=Age Limit|Important Dates|Vacancy Details|How To Fill|Mode Of Selection|Total Post|$)/i
    );

    if (feeMatch) {
        text = feeMatch[1];
    }

    //-----------------------------------------
    // Free Application
    //-----------------------------------------

    if (
        /no application fee/i.test(text) ||
        /application fee\s*:?\s*nil/i.test(text) ||
        /application fee\s*:?\s*free/i.test(text) ||
        /free for all/i.test(text)
    ) {

        result.applicationFees.push({
            category: "All Candidates",
            fee: "0"
        });

        result.isFree = true;

        return result;

    }

    //-----------------------------------------
    // Parse Multiple Categories
    //-----------------------------------------

    const regex =
        /(General(?:\s*,\s*OBC(?:\s*,\s*EWS)?)?|UR(?:\s*,\s*OBC(?:\s*,\s*EWS)?)?|SC(?:\s*,\s*ST(?:\s*,\s*PH)?)?|SC(?:\s*\/\s*ST(?:\s*\/\s*PH)?)?|SC|ST|OBC|EWS|PH|PWD|PwBD|Female|Women|Ex-Servicemen|All Candidates)\s*:\s*(?:₹|Rs\.?)?\s*(\d+)/gi;

    let match;

    const seen = new Set();

    while ((match = regex.exec(text)) !== null) {

        let category = match[1]
            .replace(/\s+/g, " ")
            .trim();

        let fee = match[2];

        if (seen.has(category.toLowerCase())) {
            continue;
        }

        seen.add(category.toLowerCase());

        result.applicationFees.push({
            category,
            fee
        });

    }

    //-----------------------------------------
    // Fallback
    //-----------------------------------------

    if (!result.applicationFees.length) {

        const fees = [...text.matchAll(/(?:₹|Rs\.?)\s*(\d+)/g)];

        if (fees.length === 1) {

            result.applicationFees.push({
                category: "All Candidates",
                fee: fees[0][1]
            });

        }

    }

    //-----------------------------------------
    // Free?
    //-----------------------------------------

    if (
        result.applicationFees.length &&
        result.applicationFees.every(f => Number(f.fee) === 0)
    ) {
        result.isFree = true;
    }

    //-----------------------------------------
    // Application Mode
    //-----------------------------------------

    if (/offline/i.test(text)) {
        result.applicationMode = "Offline";
    }

    return result;

};