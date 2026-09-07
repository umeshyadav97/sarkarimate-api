const slugify = require("slugify");

const YEAR_PATTERN = /^(.*?-\d{4})(?:-.+)?$/;

const buildDisplaySlug = (value = "") => {
    const slug = slugify(value, {
        lower: true,
        strict: true,
        trim: true,
    });

    const match = slug.match(YEAR_PATTERN);

    return match ? match[1] : slug;
};

module.exports = buildDisplaySlug;
