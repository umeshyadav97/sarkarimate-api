const mongoose = require("mongoose");
const slugify = require("slugify");

/**
 * Important Dates
 */
const importantDateSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

/**
 * Important Links
 */
const importantLinkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "apply",
                "notification",
                "official",
                "admit_card",
                "result",
                "answer_key",
                "syllabus",
                "merit_list",
                "correction",
                "exam_date",
                "city_intimation",
                "document_verification",
                "other",
            ],
            default: "other",
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        publishedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

/**
 * Vacancy Details
 */
const vacancySchema = new mongoose.Schema(
    {
        postName: {
            type: String,
            trim: true,
        },

        category: {
            type: String,
            trim: true,
        },

        totalPosts: {
            type: Number,
            default: 0,
        },
    },
    {
        _id: false,
    }
);

/**
 * Selection Process
 */
const selectionProcessSchema = new mongoose.Schema(
    {
        step: Number,

        title: String,

        description: String,
    },
    {
        _id: false,
    }
);

/**
 * FAQ
 */
const faqSchema = new mongoose.Schema(
    {
        question: String,

        answer: String,
    },
    {
        _id: false,
    }
);

/**
 * Timeline
 */
const timelineSchema = new mongoose.Schema(
    {
        stage: {
            type: String,
            trim: true,
        },

        date: {
            type: Date,
        },
    },
    {
        _id: false,
    }
);

const jobSchema = new mongoose.Schema(
    {
        /**
         * Basic Information
         */
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
            index: true,
        },

        shortDescription: {
            type: String,
            trim: true,
        },

        description: String,

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        organization: {
            type: String,
            trim: true,
        },

        state: {
            type: String,
            trim: true,
        },

        /**
         * Recruitment Details
         */
        totalPosts: {
            type: Number,
            default: 0,
        },

        vacancies: [vacancySchema],

        qualification: String,

        eligibility: [
            {
                type: String,
            },
        ],

        ageLimit: String,

        applicationFee: String,

        gender: {
            type: String,
            enum: ["Male", "Female", "Both"],
            default: "Both",
        },

        salary: String,

        selectionProcess: [selectionProcessSchema],

        /**
         * Important Dates
         */
        importantDates: [importantDateSchema],

        /**
         * Important Links
         */
        importantLinks: [importantLinkSchema],

        /**
         * Media
         */
        image: String,

        /**
         * About
         */
        aboutOrganization: String,

        faqs: [faqSchema],

        /**
         * Tags
         */
        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        /**
         * Notification Details
         */
        notificationNumber: String,

        sourceUrl: {
            type: String,
            unique: true,
            sparse: true,
        },

        source: {
            type: String,
            enum: ["MANUAL", "CRAWLER"],
            default: "MANUAL",
        },

        publishedAt: {
            type: Date,
            default: Date.now,
        },

        /**
         * Current Status
         */
        applicationStatus: {
            type: String,
            enum: [
                "Upcoming",
                "Open",
                "Closed",
                "Admit Card",
                "Answer Key",
                "Result Released",
            ],
            default: "Open",
        },

        /**
         * Homepage Sections
         */
        sections: {
            type: [
                {
                    type: String,
                    enum: [
                        "latest_job",
                        "admit_card",
                        "result",
                        "answer_key",
                        "syllabus",
                    ],
                },
            ],
            default: ["latest_job"],
        },

        /**
         * Timeline
         */
        timeline: [timelineSchema],

        /**
         * SEO
         */
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
        },

        /**
         * AI Summary
         */
        aiSummary: String,

        /**
         * Crawler
         */
        crawlStatus: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED"],
            default: "PENDING",
        },

        lastCrawledAt: Date,

        /**
         * Flags
         */
        isFeatured: {
            type: Boolean,
            default: false,
        },

        isTrending: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Generate Slug
 */
jobSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
        });
    }

    next();
});

/**
 * Text Search
 */
jobSchema.index({
    title: "text",
    organization: "text",
    tags: "text",
});

/**
 * Indexes
 */
jobSchema.index({ category: 1 });
jobSchema.index({ department: 1 });
jobSchema.index({ publishedAt: -1 });
jobSchema.index({ applicationStatus: 1 });
jobSchema.index({ sections: 1 });
jobSchema.index({ isFeatured: 1 });
jobSchema.index({ isTrending: 1 });
jobSchema.index({ sourceUrl: 1 });

module.exports = mongoose.model("Job", jobSchema);