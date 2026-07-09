const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/Apiresponse");

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(
            new ApiResponse(
                400,
                "Validation failed",
                errors.array()
            )
        );
    }

    next();
};

module.exports = validateRequest;