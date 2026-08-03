const Job = require("../models/Job");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const syllabusSeed = require("../data/syllabus.seed");

const JOB_LIST_PROJECTION =
    "title slug organization shortDescription totalPosts lastDate applicationStatus publishedAt sections";

// Keep populate/select in one place so every list card returns the same fields.
const applyJobListShape = (query) =>
    query
        .select(JOB_LIST_PROJECTION)
        .populate("category", "name slug")
        .populate("department", "name slug");

// Reuse preview queries to avoid repeating the same 5-item sidebar logic per table.
const getJobPreviewList = (sections, sortQuery) =>
    applyJobListShape(
        Job.find({
            isActive: true,
            sections,
        })
    )
        .sort(sortQuery)
        .limit(5)
        .lean();

// Syllabus is seed-backed today, so this mirrors DB pagination/search without changing the API contract.
const filterSyllabusJobs = (jobs, search) => {
    if (!search) {
        return jobs;
    }

    const searchTerm = search.trim().toLowerCase();

    return jobs.filter((job) => {
        const searchableText = [
            job.title,
            job.examName,
            job.organization,
            job.shortDescription,
            job.slug,
            job.category?.name,
            job.category?.slug,
            job.department?.name,
            job.department?.slug,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchableText.includes(searchTerm);
    });
};

const paginateArray = (items, skip, limit) => items.slice(skip, skip + limit);

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

    //----------------------------------------
    // Route Section
    //----------------------------------------

    if (sections) {
        filter.sections = sections;
    }

    //----------------------------------------
    // Filters
    //----------------------------------------

    if (category) filter.category = category;

    if (department) filter.department = department;

    if (state) filter.state = state;

    if (applicationStatus)
        filter.applicationStatus = applicationStatus;

    if (isFeatured !== undefined)
        filter.isFeatured = isFeatured === "true";

    if (isTrending !== undefined)
        filter.isTrending = isTrending === "true";

    //----------------------------------------
    // Search
    //----------------------------------------

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
                qualification: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                searchKeywords: {
                    $regex: search,
                    $options: "i",
                },
            }

        ];

    }

    //----------------------------------------
    // Sorting
    //----------------------------------------


    let sortQuery;

    // Default sorting
    if (sections === "latest_job") {
        // Latest Jobs: latest application deadline first
        sortQuery = {
            lastDateObj: -1,
            publishedAt: -1,
        };
    } else {
        // Admit Cards, Results, Answer Keys
        sortQuery = {
            publishedAt: -1,
        };
    }

    // Override if user explicitly requests a sort
    switch (sort) {


        case "oldest":
            sortQuery = {
                publishedAt: -1,
            };
            break;

        case "latest":
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

    }

    //----------------------------------------
    // Pagination
    //----------------------------------------

    let jobs = [];
    let total = 0;

    const skip = (page - 1) * limit;

    if (sections !== "syllabus") {

        [jobs, total] = await Promise.all([

            applyJobListShape(Job.find(filter))
                .sort(sortQuery)
                .skip(skip)
                .limit(limit)
                .lean(),

            Job.countDocuments(filter),

        ]);

    } else {

        jobs = filterSyllabusJobs(syllabusSeed.data.jobs, search);
        total = jobs.length;
        jobs = paginateArray(jobs, skip, limit);

    }
    const additionalData = {};
    const syllabusJobs = syllabusSeed.data.jobs.slice(0, 5);

    if (sections === "latest_job") {

        const results = await getJobPreviewList("result", { publishedAt: 1 });

        additionalData.syllabus = syllabusJobs;
        additionalData.results = results;

    }

    if (sections === "syllabus") {

        const [latestJobs, results] = await Promise.all([
    
            getJobPreviewList(
                "latest_job",
                {
                    lastDateObj: -1,
                    publishedAt: -1,
                }
            ),
    
            getJobPreviewList("result", { publishedAt: -1 }),
    
        ]);
    
        additionalData.latestJobs = latestJobs;
        additionalData.results = results;
    
    }

    if (sections === "admit_card") {

        const latestJobs = await getJobPreviewList(
            "latest_job",
            {
                lastDateObj: -1,
                publishedAt: -1,
            }
        );

        additionalData.latestJobs = latestJobs;
        additionalData.syllabus = syllabusJobs;

    }

    if (sections === "answer_key") {

        const latestJobs = await getJobPreviewList(
            "latest_job",
            {
                lastDateObj: -1,
                publishedAt: -1,
            }
        );
    
        additionalData.latestJobs = latestJobs;
        additionalData.syllabus = syllabusJobs;
    }

    if (sections === "result") {

        const latestJobs = await getJobPreviewList(
            "latest_job",
            {
                lastDateObj: -1,
                publishedAt: -1,
            }
        );

        additionalData.latestJobs = latestJobs;
        additionalData.syllabus = syllabusJobs;

    }

    return {
        jobs,
        ...additionalData,
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

    //----------------------------------------
    // Find Job By Slug
    //----------------------------------------

    const job = await Job.findOne({
        slug,
        isActive: true,
    })
        .select("-sourceUrl -__v")
        .populate("category", "name slug")
        .populate("department", "name slug")
        .lean();

    if (!job) {
        throw new ApiError(404, "Job not found.");
    }

    //----------------------------------------
    // Increment Views
    //----------------------------------------

    Job.updateOne(
        { _id: job._id },
        {
            $inc: {
                views: 1,
            },
        }
    ).catch(console.error);

    //----------------------------------------
    // Related Jobs
    //----------------------------------------

    const relatedJobs = await Job.find({
        _id: { $ne: job._id },
        isActive: true,
        sections: { $in: job.sections }
    })
        .select(
            "title slug organization lastDate applicationStatus totalPosts"
        )
        .sort({
            publishedAt: -1
        })
        .limit(8)
        .lean();

    //----------------------------------------
    // Return
    //----------------------------------------

    return {
        job,
        relatedJobs
    };
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

const getHomeJobs = async () => {

    //----------------------------------------
    // Latest Lists
    //----------------------------------------

    const [
        latestJobs,
        latestResults,
        latestAdmitCards,
        latestAnswerKeys,
        upcomingDeadlines,

        totalJobs,
        totalResults,
        totalAdmitCards,
        totalAnswerKeys,

        trendingJobs,
        featuredJobs
    ] = await Promise.all([

        //----------------------------------------
        // Latest Jobs
        //----------------------------------------

        Job.find({
            isActive: true,
            sections: "latest_job"
        })
            .select(
                "title slug organization totalPosts applicationStatus lastDate publishedAt lastDateObj lastDatePriority"
            )
            .sort({
                lastDateObj: -1,
                publishedAt: -1
            })
            .limit(10)
            .lean(),

        //----------------------------------------
        // Results
        //----------------------------------------

        Job.find({
            isActive: true,
            sections: "result"
        })
            .select(
                "title slug organization resultDate publishedAt"
            )
            .sort({ publishedAt: 1 })
            .limit(10)
            .lean(),

        //----------------------------------------
        // Admit Card
        //----------------------------------------

        Job.find({
            isActive: true,
            sections: "admit_card"
        })
            .select(
                "title slug organization admitCardDate publishedAt"
            )
            .sort({ publishedAt: 1 })
            .limit(10)
            .lean(),

        //----------------------------------------
        // Answer Key
        //----------------------------------------

        Job.find({
            isActive: true,
            sections: "answer_key"
        })
            .select(
                "title slug organization answerKeyDate publishedAt"
            )
            .sort({ publishedAt: 1 })
            .limit(10)
            .lean(),

        //----------------------------------------
        // Upcoming Last Dates
        //----------------------------------------

        Job.find({
            isActive: true,
            lastDate: {
                $nin: ["", null]
            }
        })
            .select(
                "title slug organization lastDate"
            )
            .sort({
                lastDate: 1
            })
            .limit(10)
            .lean(),

        //----------------------------------------
        // Counts
        //----------------------------------------

        Job.countDocuments({
            isActive: true,
            sections: "latest_job"
        }),

        Job.countDocuments({
            isActive: true,
            sections: "result"
        }),

        Job.countDocuments({
            isActive: true,
            sections: "admit_card"
        }),

        Job.countDocuments({
            isActive: true,
            sections: "answer_key"
        }),

        //----------------------------------------
        // Trending
        //----------------------------------------

        Job.find({
            isTrending: true,
            isActive: true
        })
            .select(
                "title slug organization"
            )
            .limit(10)
            .lean(),

        //----------------------------------------
        // Featured
        //----------------------------------------

        Job.find({
            isFeatured: true,
            isActive: true
        })
            .select(
                "title slug organization"
            )
            .limit(10)
            .lean()

    ]);

    //----------------------------------------
    // Quick Access
    //----------------------------------------

    const quickAccess = [

        {
            label: "Latest Jobs",
            count: totalJobs,
            href: "/jobs",
            type: "latest_job"
        },

        {
            label: "Results",
            count: totalResults,
            href: "/results",
            type: "result"
        },

        {
            label: "Admit Card",
            count: totalAdmitCards,
            href: "/admit-card",
            type: "admit_card"
        },

        {
            label: "Answer Key",
            count: totalAnswerKeys,
            href: "/answer-key",
            type: "answer_key"
        },

        {
            label: "Syllabus",
            count: 10,
            href: "/syllabus",
            type: "syllabus"
        },
        {
            label: "All Jobs",
            count: "100+",
            href: "/jobs",
            type: "latest_job"
        }

    ];

    //----------------------------------------
    // Popular Searches
    //----------------------------------------

    const popularSearches = [

        "SSC CGL",
        "UP Police",
        "Railway",
        "Bank",
        "UPSC",
        "BPSC",
        "NTA",
        "NEET"

    ];

    //----------------------------------------
    // Response
    //----------------------------------------

    let syllabusData = syllabusSeed.data.jobs

    return {

        popularSearches,

        quickAccess,

        latestJobs,

        latestResults,

        latestAdmitCards,

        latestAnswerKeys,

        upcomingDeadlines,

        trendingJobs,

        featuredJobs,

        stats: {

            totalJobs,

            resultsDeclared: totalResults,

            admitCards: totalAdmitCards,

            answerKeys: totalAnswerKeys,

            activeUsers: "1000+"

        },
        syllabus: syllabusData

    };

};
const getJobDetails = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Job Id.");
    }

    const job = await Job.findById(id)
        .select("-sourceUrl")
        .populate("category", "name slug")
        .populate("department", "name slug")
        .lean();

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
    getHomeJobs, getJobDetails
};
