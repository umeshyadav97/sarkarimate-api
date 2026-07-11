const express = require("express");

const {
    createJob,
    getJobs,
    getJobBySlug,
    updateJob,
    deleteJob, 
    getHomeJobs,getJobDetails
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

// Get All Jobs
router.get(
    "/",
    getJobsValidation,
    validateRequest,
    getJobs
);

// Get Single Job
router.get(
    "/:slug",
    getJobBySlugValidation,
    validateRequest,
    getJobBySlug
);

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
