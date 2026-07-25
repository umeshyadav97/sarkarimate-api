module.exports = function getLastDatePriority(
    lastDate = "",
    lastDateObj = null
) {

    if (!lastDate)
        return 99;

    const text = lastDate.toLowerCase();

    if (text.includes("available soon"))
        return 2;

    if (text.includes("notify soon"))
        return 2;

    if (text.includes("as per scheduled"))
        return 5;

    if (lastDateObj) {

        const now = new Date();

        if (
            lastDateObj.getFullYear() === now.getFullYear() &&
            lastDateObj.getMonth() === now.getMonth()
        ) {

            return 1; // current month

        }

        return 3; // normal date

    }

    return 99;
};