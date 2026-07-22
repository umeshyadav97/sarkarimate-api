module.exports = function parseSalary(text) {

    const result = {

        payLevel: "",

        payScale: "",

        payBand: "",

        gradePay: "",

        basicPay: "",

        inHandSalary: "",

        monthlySalary: ""

    };

    if (!text) {
        return result;
    }

    //-----------------------------------------
    // Normalize
    //-----------------------------------------

    text = text
        .replace(/\r/g, " ")
        .replace(/\t/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    //-----------------------------------------
    // Pay Level
    //-----------------------------------------

    let match = text.match(
        /(Pay\s*Level|Level|Pay\s*Matrix\s*Level)\s*[:-]?\s*([0-9A-Za-z\-]+)/i
    );

    if (match) {

        result.payLevel = match[2];

    }

    //-----------------------------------------
    // Pay Band
    //-----------------------------------------

    match = text.match(
        /Pay\s*Band\s*[:-]?\s*([A-Za-z0-9\- ]+)/i
    );

    if (match) {

        result.payBand = match[1].trim();

    }

    //-----------------------------------------
    // Grade Pay
    //-----------------------------------------

    match = text.match(
        /Grade\s*Pay\s*[:-]?\s*(?:Rs\.?|₹)?\s*([\d,]+)/i
    );

    if (match) {

        result.gradePay = `₹${match[1]}`;

    }

    //-----------------------------------------
    // Basic Pay
    //-----------------------------------------

    match = text.match(
        /Basic\s*Pay\s*[:-]?\s*(?:Rs\.?|₹)?\s*([\d,]+)/i
    );

    if (match) {

        result.basicPay = `₹${match[1]}`;

    }

    //-----------------------------------------
    // In Hand Salary
    //-----------------------------------------

    match = text.match(
        /(In\s*Hand\s*Salary|Take\s*Home\s*Salary)\s*[:-]?\s*(?:Rs\.?|₹)?\s*([\d,]+)/i
    );

    if (match) {

        result.inHandSalary = `₹${match[2]}`;

    }

    //-----------------------------------------
    // Monthly Salary
    //-----------------------------------------

    match = text.match(
        /(Monthly\s*Salary|Salary)\s*[:-]?\s*(?:Rs\.?|₹)?\s*([\d,]+)/i
    );

    if (match) {

        result.monthlySalary = `₹${match[2]}`;

    }

    //-----------------------------------------
    // Salary Range
    //-----------------------------------------

    match = text.match(
        /(?:Rs\.?|₹)?\s*([\d,]+)\s*(?:\/-)?\s*(?:to|-|–)\s*(?:Rs\.?|₹)?\s*([\d,]+)/i
    );

    if (match) {

        result.payScale = `₹${match[1]} - ₹${match[2]}`;

    }

    //-----------------------------------------
    // Pay Matrix Example
    // ₹25500-81100
    //-----------------------------------------

    if (!result.payScale) {

        match = text.match(
            /₹?\s*([\d,]{4,6})\s*[-–]\s*([\d,]{4,6})/
        );

        if (match) {

            result.payScale = `₹${match[1]} - ₹${match[2]}`;

        }

    }

    return result;

};