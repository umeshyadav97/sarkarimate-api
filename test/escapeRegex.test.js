const test = require("node:test");
const assert = require("node:assert/strict");
const escapeRegex = require("../src/utils/escapeRegex");

test("escapes regex syntax so search terms are literal", () => {
    const input = "(SSC|UP).*+?^$[]{}\\";
    const escaped = escapeRegex(input);
    assert.equal(new RegExp(escaped, "i").test(input), true);
    assert.equal(new RegExp(escaped, "i").test("SSC UP anything"), false);
});
