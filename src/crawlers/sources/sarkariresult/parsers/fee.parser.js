module.exports = function parseFee(text) {

    const result = {
        applicationFees: [],
        applicationMode: "Online",
        feeRefund: {
            refunds: [],
            description: ""
        },
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

    let feeSection = text;
    let refundSection = "";

    const refundIndex = text.search(/(?:Fee|Fess)\s*Refund/i);

    if (refundIndex !== -1) {
        feeSection = text.slice(0, refundIndex);
        refundSection = text.slice(refundIndex);
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



    const seen = new Set();

    const lines = feeSection
        .split(/(?=For\s)|(?=General)|(?=SC)|(?=UR)|(?=OBC)|(?=EWS)|(?=Payment Mode)/i)
        .map(line => line.trim())
        .filter(Boolean);

    for (const line of lines) {

        if (/payment mode/i.test(line)) {
            break;
        }

        const match = line.match(
            /^(?:For\s+)?(.+?)\s*:\s*(?:₹|Rs\.?)\s*(\d+)/i
        );

        if (!match) {
            continue;
        }

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
    // Parse Refund
    //-----------------------------------------

    if (refundSection) {

        const refundRegex =
            /(?:General(?:\s*\/\s*OBC)?|Other Candidates?|SC(?:\s*\/\s*ST)?|EBC|PH|PWD|PwBD|Female|Women|All Category Female|All Female)\s*:\s*(?:Rs\.?|₹)\s*(\d+)/gi;
        while ((match = refundRegex.exec(refundSection)) !== null) {

            result.feeRefund.refunds.push({
                category: match[1].trim(),
                fee: match[2]
            });

        }

        const desc = refundSection.match(
            /Will Be Refunded[\s\S]*?(?=Payment Mode|Mode Of Payment|$)/i
        );

        if (desc) {

            result.feeRefund.description = desc[0]
                .replace(/\s+/g, " ")
                .trim();

        }

    }

    //-----------------------------------------
    // Fallback
    //-----------------------------------------

    if (!result.applicationFees.length) {

        const fees = [...feeSection.matchAll(/(?:₹|Rs\.?)\s*(\d+)/g)];

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