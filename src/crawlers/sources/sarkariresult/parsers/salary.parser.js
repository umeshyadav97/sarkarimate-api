module.exports = function parseSalary(text) {

    const salary = {

        payLevel: "",

        payScale: "",

        gradePay: "",

        basicPay: "",

        inHandSalary: ""

    };

    if (!text) {
        return salary;
    }

    //---------------------------------------
    // Pay Level
    //---------------------------------------

    let match = text.match(/Pay\s*Level\s*[:-]?\s*([0-9A-Za-z]+)/i);

    if (match) {
        salary.payLevel = match[1];
    }

    //---------------------------------------
    // Grade Pay
    //---------------------------------------

    match = text.match(/Grade\s*Pay\s*[:-]?\s*₹?\s*([\d,]+)/i);

    if (match) {
        salary.gradePay = `₹${match[1]}`;
    }

    //---------------------------------------
    // Basic Pay
    //---------------------------------------

    match = text.match(/Basic\s*Pay\s*[:-]?\s*₹?\s*([\d,]+)/i);

    if (match) {
        salary.basicPay = `₹${match[1]}`;
    }

    //---------------------------------------
    // Salary Range
    //---------------------------------------

    match = text.match(/₹?\s*([\d,]+)\s*[-–]\s*₹?\s*([\d,]+)/);

    if (match) {
        salary.payScale = `₹${match[1]} - ₹${match[2]}`;
    }

    return salary;

};