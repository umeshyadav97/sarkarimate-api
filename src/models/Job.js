const mongoose = require("mongoose");
const slugify = require("slugify");

/**
 * ==========================================
 * Important Dates
 * ==========================================
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
        },

        status: {
            type: String,
            enum: ["completed", "current", "upcoming"],
            default: "upcoming",
        },

        highlight: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * Important Links
 * ==========================================
 */
const importantLinkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "apply",
                "notification",
                "official",
                "login",
                "result",
                "admit_card",
                "answer_key",
                "syllabus",
                "correction",
                "exam_date",
                "city_intimation",
                "document_verification",
                "merit_list",
                "other",
            ],
            default: "other",
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        isPrimary: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * Application Fees
 * ==========================================
 */
const applicationFeeSchema = new mongoose.Schema(
    {
        category: String,
        fee: String,
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * Age Relaxation
 * ==========================================
 */
const ageRelaxationSchema = new mongoose.Schema(
    {
        category: String,
        relaxation: String,
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * Reservation
 * ==========================================
 */
const reservationSchema = new mongoose.Schema(
    {
        UR: Number,
        OBC: Number,
        EWS: Number,
        SC: Number,
        ST: Number,
        PH: Number,
        Other: Number,
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * Vacancy Details
 * ==========================================
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

        district: {
            type: String,
            trim: true,
        },

        totalPosts: {
            type: Number,
            default: 0,
        },

        qualification: String,

        salary: String,

        lastDate: String,

        notificationPdf: String,

        applyLink: String,

        reservation: reservationSchema,
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * Salary
 * ==========================================
 */
const salarySchema = new mongoose.Schema(
    {
        payLevel: String,

        payScale: String,

        gradePay: String,

        basicPay: String,

        inHandSalary: String,
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * Exam Pattern
 * ==========================================
 */
const examPatternSchema = new mongoose.Schema(
    {
        subject: String,

        questions: Number,

        marks: Number,

        duration: String,
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * Selection Process
 * ==========================================
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
 * ==========================================
 * Physical Standard
 * ==========================================
 */
const physicalStandardSchema = new mongoose.Schema(
    {
        category: String,

        male: String,

        female: String,
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * FAQ
 * ==========================================
 */
const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },

        answer: {
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
 * ==========================================
 * Timeline
 * ==========================================
 */
const timelineSchema = new mongoose.Schema(
    {
        stage: String,

        title: String,

        description: String,

        date: String,

        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * Dynamic Content Section
 * Used for sections like:
 * - Eligibility
 * - Physical Test
 * - Medical Test
 * - Exam Scheme
 * - Important Instructions
 * ==========================================
 */
const contentSectionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        content: String,
    },
    {
        _id: false,
    }
);

/**
 * ==========================================
 * Other Information
 * ==========================================
 */
const otherInformationSchema = new mongoose.Schema(
    {
        title: String,

        value: String,
    },
    {
        _id: false,
    }
);
const jobSchema = new mongoose.Schema(
    {
        /**
         * ==========================================
         * BASIC INFORMATION
         * ==========================================
         */

        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
            sparse: true,
        },

        shortDescription: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },

        organization: {
            type: String,
            trim: true,
        },

        state: {
            type: String,
            trim: true,
        },

        city: String,

        jobLocation: String,

        jobType: {
            type: String,
            enum: [
                "Permanent",
                "Contract",
                "Apprentice",
                "Internship",
                "Temporary",
                "Part Time",
                "Full Time",
                "Other",
            ],
            default: "Other",
        },

        applicationMode: {
            type: String,
            enum: [
                "Online",
                "Offline",
                "Both",
            ],
            default: "Online",
        },

        /**
         * ==========================================
         * RECRUITMENT DETAILS
         * ==========================================
         */

        totalPosts: {
            type: Number,
            default: 0,
        },

        vacancies: [vacancySchema],

        qualification: String,

        qualifications: [
            {
                postName: String,
                qualification: String,
            },
        ],

        eligibility: [
            {
                title: {
                    type: String,
                    trim: true,
                },
                qualification: {
                    type: String,
                    trim: true,
                },
            },
        ],

        whoCanApply: [
            String,
        ],

        documentsRequired: [
            String,
        ],

        howToApply: [
            String,
        ],

        ageLimit: String,

        minimumAge: Number,

        maximumAge: Number,

        ageAsOn: String,

        ageRelaxations: [
            ageRelaxationSchema,
        ],

        applicationFee: String,

        applicationFees: [
            applicationFeeSchema,
        ],

        isFree: {
            type: Boolean,
            default: false,
        },

        applicationFeeAmount: Number,

        gender: {
            type: String,
            enum: [
                "Male",
                "Female",
                "Both",
            ],
            default: "Both",
        },

        experience: String,

        nationality: String,

        salary: salarySchema,

        selectionProcess: [
            selectionProcessSchema,
        ],

        examPattern: [
            examPatternSchema,
        ],

        physicalStandards: [
            physicalStandardSchema,
        ],

        medicalStandards: [
            String,
        ],

        /**
         * ==========================================
         * IMPORTANT DATES
         * ==========================================
         */

        importantDates: [
            importantDateSchema,
        ],

        notificationDate: String,

        applicationStartDate: String,

        lastDate: String,

        lastDateObj: {
            type: Date,
            default: null,
        },
        
        lastDatePriority: {
            type: Number,
            default: 99,
        },

        lastFeeDate: String,

        correctionDate: String,

        examDate: String,

        admitCardDate: String,

        answerKeyDate: String,

        resultDate: String,

        interviewDate: String,

        documentVerificationDate: String,

        joiningDate: String,

        /**
         * ==========================================
         * IMPORTANT LINKS
         * ==========================================
         */

        importantLinks: [
            importantLinkSchema,
        ],

        applyLink: String,

        notificationPdf: String,

        officialWebsite: String,

        loginLink: String,

        answerKeyLink: String,

        resultLink: String,

        admitCardLink: String,

        syllabusLink: String,

        /**
         * ==========================================
         * ABOUT SECTION
         * ==========================================
         */

        image: String,

        aboutOrganization: String,

        aboutRecruitment: String,

        officialNotificationSummary: String,

        aiSummary: String,

        /**
         * ==========================================
         * EXTRA CONTENT
         * ==========================================
         */

        contentSections: [
            contentSectionSchema,
        ],

        otherInformation: [
            otherInformationSchema,
        ],

        /**
         * ==========================================
         * FAQ
         * ==========================================
         */

        faqs: [
            faqSchema,
        ],

        /**
         * ==========================================
         * TIMELINE
         * ==========================================
         */

        timeline: [
            timelineSchema,
        ],

        /**
         * ==========================================
         * QUICK OVERVIEW
         * ==========================================
         */

        quickOverview: {

            totalPosts: Number,

            qualification: String,

            minimumAge: Number,

            maximumAge: Number,

            ageLimit: String,

            applicationFee: String,

            salary: String,

            jobLocation: String,

            applicationMode: String,

            lastDate: String,
        },

        /**
         * ==========================================
         * TAGS
         * ==========================================
         */

        tags: [
            String,
        ],

        searchKeywords: [
            String,
        ],

        /**
         * ==========================================
         * SEO
         * ==========================================
         */

        seo: {

            metaTitle: String,

            metaDescription: String,

            keywords: [
                String,
            ],
        },

        /**
         * ==========================================
         * SOURCE
         * ==========================================
         */

        notificationNumber: String,

        sourceUrl: {
            type: String,
            unique: true,
            sparse: true,
        },

        source: {
            type: String,
            enum: [
                "MANUAL",
                "CRAWLER",
            ],
            default: "CRAWLER",
        },

        publishedAt: {
            type: Date,
            default: Date.now,
        },

        lastCrawledAt: Date,

        crawlStatus: {
            type: String,
            enum: [
                "PENDING",
                "SUCCESS",
                "FAILED",
            ],
            default: "PENDING",
        },

        /**
         * ==========================================
         * STATUS
         * ==========================================
         */

        notificationType: {

            type: String,
        
            enum: [
        
                "JOB",
        
                "RESULT",
        
                "ADMIT_CARD",
        
                "ANSWER_KEY",
        
                "SYLLABUS",
        
                "ADMISSION",
        
                "SCHOLARSHIP"
        
            ],
        
            default: "JOB"
        
        },
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
                        "admission",
                        "scholarship",
                    ],
                },
            ],
            default: [
                "latest_job",
            ],
        },

        /**
         * ==========================================
         * FLAGS
         * ==========================================
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
* ==========================================
* Generate Unique Slug
* ==========================================
*/
jobSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug =
            slugify(this.title, {
                lower: true,
                strict: true,
                trim: true,
            }) +
            "-" +
            Date.now();
    }

    next();
});

/**
 * ==========================================
 * Auto Generate Quick Overview
 * ==========================================
 */
jobSchema.pre("save", function (next) {
    this.quickOverview = {
        totalPosts: this.totalPosts,
        qualification: this.qualification,
        minimumAge: this.minimumAge,
        maximumAge: this.maximumAge,
        ageLimit: this.ageLimit,
        applicationFee: this.applicationFee,
        salary: this.salary?.payScale || "",
        jobLocation: this.jobLocation,
        applicationMode: this.applicationMode,
        lastDate: this.lastDate,
    };

    next();
});

/**
 * ==========================================
 * Full Text Search
 * ==========================================
 */
jobSchema.index({
    title: "text",
    organization: "text",
    description: "text",
    qualification: "text",
    tags: "text",
    searchKeywords: "text",
});

/**
 * ==========================================
 * Indexes
 * ==========================================
 */

// Search Filters
jobSchema.index({ category: 1 });
jobSchema.index({ department: 1 });
jobSchema.index({ organization: 1 });
jobSchema.index({ state: 1 });
jobSchema.index({ sections: 1 });

// Status
jobSchema.index({ applicationStatus: 1 });
jobSchema.index({ isFeatured: 1 });
jobSchema.index({ isTrending: 1 });
jobSchema.index({ isActive: 1 });

// Dates
jobSchema.index({ publishedAt: -1 });
jobSchema.index({
    lastDatePriority: 1,
    lastDateObj: 1,
});
jobSchema.index({ applicationStartDate: 1 });
jobSchema.index({ examDate: 1 });
jobSchema.index({ admitCardDate: 1 });
jobSchema.index({ resultDate: 1 });

// Analytics
jobSchema.index({ views: -1 });

// Source
jobSchema.index({ source: 1 });
jobSchema.index({ sourceUrl: 1 });

// Homepage
jobSchema.index({
    sections: 1,
    publishedAt: -1,
});

jobSchema.index({
    sections: 1,
    isFeatured: 1,
});

jobSchema.index({
    sections: 1,
    isTrending: 1,
});

/**
 * ==========================================
 * Compound Indexes
 * ==========================================
 */

jobSchema.index({
    isActive: 1,
    sections: 1,
    lastDatePriority: 1,
    lastDateObj: 1,
    publishedAt: -1,
});

jobSchema.index({
    organization: 1,
    applicationStatus: 1,
});

jobSchema.index({
    category: 1,
    department: 1,
});

/**
 * ==========================================
 * Virtual
 * ==========================================
 */

jobSchema.virtual("isExpired").get(function () {

    if (!this.lastDateObj)
        return false;

    return this.lastDateObj < new Date();

});

/**
 * ==========================================
 * JSON Options
 * ==========================================
 */

jobSchema.set("toJSON", {
    virtuals: true,
});

jobSchema.set("toObject", {
    virtuals: true,
});

/**
 * ==========================================
 * Export Model
 * ==========================================
 */

module.exports = mongoose.model("Job", jobSchema);