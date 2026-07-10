const Job = require("../models/Job");
const ApiError = require("../utils/ApiError");

/**
 * Create Job
 */
const createJob = async (payload) => {
    // Duplicate check by Source URL
    if (payload.sourceUrl) {
        const existingJob = await Job.findOne({
            sourceUrl: payload.sourceUrl,
        });

        if (existingJob) {
            throw new ApiError(409, "Job already exists.");
        }
    }

    const job = await Job.create(payload);

    return job;
};

/**
 * Get All Jobs
 */
const getJobs = async (query) => {
    let {
        page = 1,
        limit = 20,
        search,
        category,
        department,
        state,
        applicationStatus,
        sections,
        isFeatured,
        isTrending,
        sort = "latest",
    } = query;

    page = Number(page);
    limit = Number(limit);

    const filter = {
        isActive: true,
    };

    if (category) filter.category = category;
    if (department) filter.department = department;
    if (state) filter.state = state;
    if (applicationStatus) filter.applicationStatus = applicationStatus;

    if (sections) {
        filter.sections = Array.isArray(sections)
            ? { $in: sections }
            : sections;
    }

    if (isFeatured !== undefined)
        filter.isFeatured = isFeatured === "true";

    if (isTrending !== undefined)
        filter.isTrending = isTrending === "true";

    if (search) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                organization: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                tags: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                qualification: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    let sortQuery = {};

    switch (sort) {
        case "oldest":
            sortQuery = {
                publishedAt: 1,
            };
            break;

        case "views":
            sortQuery = {
                views: -1,
            };
            break;

        case "featured":
            sortQuery = {
                isFeatured: -1,
                publishedAt: -1,
            };
            break;

        case "latest":
        default:
            sortQuery = {
                publishedAt: -1,
            };
            break;
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
        Job.find(filter)
            .populate("category", "name slug")
            .populate("department", "name slug")
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .lean(),

        Job.countDocuments(filter),
    ]);

    return {
        jobs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    };
};

/**
 * Get Job Details
 */
const getJobBySlug = async (slug) => {
    const job = await Job.findOne({
        slug,
        isActive: true,
    })
        .populate("category")
        .populate("department");

    if (!job) {
        throw new ApiError(404, "Job not found.");
    }

    // Increment View Count
    await Job.findByIdAndUpdate(job._id, {
        $inc: {
            views: 1,
        },
    });

    return job;
};

/**
 * Update Job
 */
const updateJob = async (id, payload) => {
    const job = await Job.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    if (!job) {
        throw new ApiError(404, "Job not found.");
    }

    return job;
};

/**
 * Soft Delete Job
 */
const deleteJob = async (id) => {
    const job = await Job.findByIdAndUpdate(
        id,
        {
            isActive: false,
        },
        {
            new: true,
        }
    );

    if (!job) {
        throw new ApiError(404, "Job not found.");
    }

    return job;
};

module.exports = {
    createJob,
    getJobs,
    getJobBySlug,
    updateJob,
    deleteJob,
};