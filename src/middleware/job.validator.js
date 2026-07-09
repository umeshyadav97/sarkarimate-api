const { body, param, query } = require("express-validator");

const createJobValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 250 })
        .withMessage("Title cannot exceed 250 characters"),

    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isMongoId()
        .withMessage("Invalid category id"),

    body("department")
        .notEmpty()
        .withMessage("Department is required")
        .isMongoId()
        .withMessage("Invalid department id"),

    body("organization")
        .trim()
        .notEmpty()
        .withMessage("Organization is required"),

    body("sourceUrl")
        .optional()
        .isURL()
        .withMessage("Invalid source url"),

    body("officialWebsite")
        .optional()
        .isURL()
        .withMessage("Invalid official website"),

    body("notificationPdf")
        .optional()
        .isURL()
        .withMessage("Invalid notification PDF URL"),

    body("applyLink")
        .optional()
        .isURL()
        .withMessage("Invalid apply link"),
];

const updateJobValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid job id"),

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),

    body("category")
        .optional()
        .isMongoId()
        .withMessage("Invalid category id"),

    body("department")
        .optional()
        .isMongoId()
        .withMessage("Invalid department id"),

    body("sourceUrl")
        .optional()
        .isURL()
        .withMessage("Invalid source URL"),
];

const getJobBySlugValidation = [
    param("slug")
        .trim()
        .notEmpty()
        .withMessage("Job slug is required"),
];

const getJobsValidation = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
];

module.exports = {
    createJobValidation,
    updateJobValidation,
    getJobBySlugValidation,
    getJobsValidation,
};