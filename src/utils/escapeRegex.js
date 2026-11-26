// Treat user search text as a literal substring, never as a regex program.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = escapeRegex;
