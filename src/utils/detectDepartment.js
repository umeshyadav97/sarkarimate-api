module.exports = function detectDepartment(text = "") {
    text = text.toLowerCase();

    if (text.includes("ssc")) return "SSC";
    if (text.includes("upsc")) return "UPSC";
    if (text.includes("rrb") || text.includes("railway")) return "Railway";
    if (text.includes("ibps")) return "IBPS";
    if (text.includes("sbi")) return "SBI";
    if (text.includes("mppsc")) return "MPPSC";
    if (text.includes("uppsc")) return "UPPSC";
    if (text.includes("bpsc")) return "BPSC";
    if (text.includes("rpsc")) return "RPSC";
    if (text.includes("hpsc")) return "HPSC";
    if (text.includes("jpsc")) return "JPSC";

    return "Other";
};