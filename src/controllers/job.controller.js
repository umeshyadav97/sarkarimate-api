const JobService = require("../services/job.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/Apiresponse");
const ApiError = require("../utils/ApiError");
const syllabusSeed = require("../data/syllabus.seed");

/**
 * @desc    Create Job
 * @route   POST /api/v1/jobs
 */
const createJob = catchAsync(async (req, res) => {
    const job = await JobService.createJob(req.body);

    return res
        .status(201)
        .json(new ApiResponse("Job created successfully.", job));
});

/**
 * @desc    Get All Jobs
 * @route   GET /api/v1/jobs
 */
const getJobs = catchAsync(async (req, res) => {
    const {
        type = "jobs",
        ...query
    } = req.query;

    const sectionMap = {
        jobs: "latest_job",
        "admit-cards": "admit_card",
        results: "result",
        "answer-keys": "answer_key",
        syllabus: "syllabus",
    };

    const sections = sectionMap[type];

    if (!sections) {
        throw new ApiError(400, "Invalid job type.");
    }

    if (type === "syllabus") {
        return res.status(200).json(syllabusSeed);
    }

    const data = await JobService.getJobs({
        ...query,
        sections,
    });

    const messages = {
        jobs: "Latest jobs fetched successfully.",
        "admit-cards": "Admit cards fetched successfully.",
        results: "Results fetched successfully.",
        "answer-keys": "Answer keys fetched successfully.",
        syllabus: "Syllabus guides fetched successfully.",
    };

    return res.status(200).json(
        new ApiResponse(
            messages[type] || "Jobs fetched successfully.",
            data
        )
    );
});

/**
 * @desc    Get Job By Slug
 * @route   GET /api/v1/jobs/:slug
 */
const getJobBySlug = catchAsync(async (req, res) => {
    const job = await JobService.getJobBySlug(req.params.slug);

    return res
        .status(200)
        .json(new ApiResponse("Job fetched successfully.", job));
});

/**
 * @desc    Update Job
 * @route   PATCH /api/v1/jobs/:id
 */
const updateJob = catchAsync(async (req, res) => {
    const job = await JobService.updateJob(req.params.id, req.body);

    return res
        .status(200)
        .json(new ApiResponse("Job updated successfully.", job));
});

/**
 * @desc    Delete Job
 * @route   DELETE /api/v1/jobs/:id
 */
const deleteJob = catchAsync(async (req, res) => {
    await JobService.deleteJob(req.params.id);

    return res
        .status(200)
        .json(new ApiResponse("Job deleted successfully."));
});

/**
 * @desc Home Jobs
 * @route GET /api/v1/jobs/home
 */
const getHomeJobs = catchAsync(async (req, res) => {
    const result = await JobService.getHomeJobs(req.query);

    return res
        .status(200)
        .json(new ApiResponse("Home jobs fetched successfully.", result));
});

/**
 * @desc Get Job Details
 * @route GET /api/v1/jobs/details/:id
 */
const getJobDetails = catchAsync(async (req, res) => {
    const result = await JobService.getJobDetails(req.params.id);

    return res.status(200).json(
        new ApiResponse("Job details fetched successfully.", result)
    );
});

module.exports = {
    createJob,
    getJobs,
    getJobBySlug,
    updateJob,
    deleteJob,
    getHomeJobs, getJobDetails
};
