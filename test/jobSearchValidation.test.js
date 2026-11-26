const test = require("node:test");
const assert = require("node:assert/strict");
const { validationResult } = require("express-validator");
const { getJobsValidation } = require("../src/middleware/job.validator");

const validateSearch = async (search) => {
    const req = { query: { search } };
    await getJobsValidation[0].run(req);
    return { req, errors: validationResult(req).array() };
};

test("accepts and trims search text within the maximum length", async () => {
    const { req, errors } = await validateSearch("  SSC CGL.*  ");
    assert.deepEqual(errors, []);
    assert.equal(req.query.search, "SSC CGL.*");
});

test("rejects search text longer than 100 characters", async () => {
    const { errors } = await validateSearch("a".repeat(101));
    assert.equal(errors.length, 1);
    assert.equal(errors[0].msg, "Search cannot exceed 100 characters");
});
