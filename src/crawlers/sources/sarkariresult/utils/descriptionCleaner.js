function cleanDescription(text = "") {

    return text

        .replace(/Sarkari Result®/gi, "")

        .replace(/WWW\.SARKARIRESULT\.COM/gi, "")

        .replace(/SarkariResult\.com/gi, "")

        .replace(/Join Sarkari Result Channel[\s\S]*/gi, "")

        .replace(/Download Mobile Apps[\s\S]*/gi, "")

        .replace(/Remove Background/gi, "")

        .replace(/Sarkari Result Portal/gi, "")

        .replace(/\s+/g, " ")

        .trim();

}

module.exports = cleanDescription;