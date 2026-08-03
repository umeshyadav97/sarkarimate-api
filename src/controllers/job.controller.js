const JobService = require("../services/job.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/Apiresponse");
const ApiError = require("../utils/ApiError");
const syllabusSeed = require("../data/syllabus.seed");
const JobSubscription = require("../models/JobSubscription");
const SubDepartment = require("../models/SubDepartment");
const Category = require("../models/Category");
const Department = require("../models/Department");


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

    // if (sections === "syllabus") {
    //     return res.status(200).json(syllabusSeed);
    // }

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

const subscribe = async (req, res) => {
    try {
        const { email, allCategories, category, subCategory } = req.body;

        const subscription = await JobSubscription.findOneAndUpdate(
            { email },
            {
                email,
                allCategories,
                category,
                subCategory,
                isActive: true,
            },
            {
                upsert: true,
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Subscription saved successfully.",
            data: subscription,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
const getCategories = async (req, res) => {
    try {

        const categories = await Department.find(
            { isActive: true },
            "name slug"
        ).sort({ name: 1 });

        return res.json({
            success: true,
            data: categories,
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message,
        });

    }
};

const getSubCategories = async (req, res) => {
    try {

        const { categoryId } = req.params;

        const subCategories = await SubDepartment.find(
            {
                department: categoryId,
                isActive: true,
            },
            "name slug"
        ).sort({ name: 1 });

        return res.json({
            success: true,
            data: subCategories,
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message,
        });

    }
};



module.exports = {
    createJob,
    getJobs,
    getJobBySlug,
    updateJob,
    deleteJob,
    getHomeJobs, getJobDetails, subscribe, getCategories, getSubCategories
};