module.exports = function parseFee(text) {

    const result = {

        applicationFees: [],

        applicationMode: "Online",

        isFree: false,

    };

    if (!text) {
        return result;
    }

    //------------------------------------------
    // Clean text
    //------------------------------------------

    text = text
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .replace(/\s+/g, " ");

    //------------------------------------------
    // Extract every fee line
    //------------------------------------------

    const regex = /([A-Za-z\/() ]+?)\s*:\s*(Rs\.?\s*)?(\d+)\s*\/?-?/gi;

    let match;

    while ((match = regex.exec(text)) !== null) {

        const category = match[1].trim();

        const fee = match[3];

        result.applicationFees.push({

            category,

            fee

        });

    }

    //------------------------------------------
    // Detect Free Form
    //------------------------------------------

    if (
        result.applicationFees.length &&
        result.applicationFees.every(x => Number(x.fee) === 0)
    ) {

        result.isFree = true;

    }

    //------------------------------------------
    // Remove duplicate categories
    //------------------------------------------

    result.applicationFees = result.applicationFees.filter(

        (item, index, self) =>

            index === self.findIndex(

                x =>

                    x.category.toLowerCase() ===
                    item.category.toLowerCase()

            )

    );

    return result;

};