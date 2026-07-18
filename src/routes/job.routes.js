const express = require("express");

const {
    createJob,
    getJobs,
    getJobBySlug,
    updateJob,
    deleteJob,
    getHomeJobs, getJobDetails
} = require("../controllers/job.controller");

const validateRequest = require("../middleware/validateRequest");

const {
    createJobValidation,
    getJobsValidation,
    getJobBySlugValidation,
    updateJobValidation,
} = require("../middleware/job.validator");

const router = express.Router();

/**
 * Job Routes
 */

// Create Job
router.post(
    "/",
    createJobValidation,
    validateRequest,
    createJob
);

// Home Jobs
router.get(
    "/home",
    getJobsValidation,
    validateRequest,
    getHomeJobs
);

// Listings
// router.get("/", getJobs);
// router.get("/admit-cards", getJobs);
// router.get("/results", getJobs);
// router.get("/answer-keys", getJobs);

router.get(
    "/",
    getJobsValidation,
    validateRequest,
    getJobs
);


router.get("/:slug", getJobBySlug);

// Update Job
router.patch(
    "/:id",
    updateJobValidation,
    validateRequest,
    updateJob
);

// Delete Job
router.delete(
    "/:id",
    updateJobValidation,
    validateRequest,
    deleteJob
);

router.get(
    "/details/:id",
    getJobDetails
);

module.exports = router;
