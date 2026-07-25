const parseBasic = require("./parsers/basic.parser");
const parseDates = require("./parsers/dates.parser");
const parseLinks = require("./parsers/links.parser");
const parseVacancies = require("./parsers/tableVacancy.parser");
const parseAge = require("./parsers/age.parser");
const parseFee = require("./parsers/fee.parser");
const parseSelection = require("./parsers/selection.parser");
const parseSalary = require("./parsers/salary.parser");
const parseSections = require("./parsers/sections.parser");
const parseEligibility = require("./parsers/eligibility.parser");
const parseLastDate = require("../../../utils/parseLastDate");
const getLastDatePriority = require("../../../utils/getLastDatePriority");
const parseFaq = require("./parsers/faq.parser");

/**
 * Convert table object to plain text
 */
/**
 * Convert section to text
 */
function getSectionText(section) {

    if (!section) {
        return "";
    }

    // Already plain text
    if (typeof section === "string") {
        return section;
    }

    // Table object
    if (section.rows) {
        return section.rows
            .map(row =>
                row
                    .map(cell => cell.text || "")
                    .join(" ")
            )
            .join("\n");
    }

    return "";
}

module.exports.mapJob = function (detail) {

    //--------------------------------
    // Extract Sections
    //--------------------------------

    const sections = parseSections(detail);

    //--------------------------------
    // Parse Data
    //--------------------------------

    const links = parseLinks(detail);
    const basic = parseBasic(detail);
    const vacancy = parseVacancies(detail);

    const eligibility = parseEligibility(detail);

    const dates = parseDates(
        getSectionText(sections.dates)
    );

    const lastDateObj = parseLastDate(dates.lastDate);

    const lastDatePriority = getLastDatePriority(
        dates.lastDate,
        lastDateObj
    );

    const age = parseAge(
        getSectionText(sections.age)
    );

    const fee = parseFee(
        getSectionText(sections.fee)
    );

    const selection = parseSelection(
        getSectionText(sections.selection)
    );

    const salary = parseSalary(
        getSectionText(sections.salary)
    );

    const faqs = parseFaq(detail);

    //--------------------------------
    // Final Object
    //--------------------------------

    console.log("DATES =>", sections.dates);
    console.log("FEE =>", sections.fee);
    console.log("AGE =>", sections.age);

    return {

        //--------------------------------
        // Basic
        //--------------------------------

        ...basic,

        sourceUrl: detail.url,

        displaySection: detail.section,

        notificationType:
            detail.section === "result"
                ? "RESULT"
                : detail.section === "admit_card"
                    ? "ADMIT_CARD"
                    : detail.section === "answer_key"
                        ? "ANSWER_KEY"
                        : "JOB",

        //--------------------------------
        // Parsed
        //--------------------------------

        ...dates,

         lastDateObj,

         lastDatePriority,

        ...links,

        ...vacancy,

        ...eligibility,

        ...age,

        ...fee,

        ...selection,

        salary,

        faqs,

        //--------------------------------
        // Status
        //--------------------------------

        sections: [detail.section],

        source: "CRAWLER",

        crawlStatus: "SUCCESS",

        publishedAt: new Date(),

        lastCrawledAt: new Date(),

        isActive: true,

        isFeatured: false,

        isTrending: false,

        views: 0,

        //--------------------------------
        // Overview
        //--------------------------------

        quickOverview: {

            totalPosts: vacancy.totalPosts || 0,
        
            qualification:
                vacancy.qualification ||
                (eligibility.qualifications || [])
                    .map(q => q.qualification)
                    .join(" | "),
        
            qualificationCount:
                (eligibility.qualifications || []).length,
        
            minimumAge: age.minimumAge || null,
        
            maximumAge: age.maximumAge || null,
        
            salary:
                salary.payScale ||
                salary.basicPay ||
                "",
        
            lastDate: dates.lastDate || "",
        
        },

        //--------------------------------
        // Search
        //--------------------------------

        searchKeywords: [

            basic.title,

            basic.organization,

            basic.state,

            ...(eligibility.qualifications || []).map(
                q => q.qualification
            ),

            ...(vacancy.vacancies || []).map(
                v => v.postName
            )

        ]
            .flat()
            .filter(Boolean)
            .map(v => v.trim())
            .filter((v, i, arr) => arr.indexOf(v) === i),

        //--------------------------------
        // SEO
        //--------------------------------

        seo: {

            metaTitle: basic.title,

            metaDescription:
                (basic.shortDescription || "").substring(0, 160),

            keywords: [

                basic.title,

                basic.organization,

                basic.state,

                ...(vacancy.vacancies || []).map(v => v.postName),

                ...(eligibility.qualifications || []).map(
                    q => q.qualification
                ),

                detail.section,

                "Government Job",

                "Latest Jobs",

                "Govt Jobs"

            ]
                .flat()
                .filter(Boolean)
                .map(v => v.trim())
                .filter((v, i, arr) => arr.indexOf(v) === i)

        },

        quickOverview: {

            totalPosts: vacancy.totalPosts || 0,

            qualification:
                vacancy.qualification ||
                (eligibility.qualifications || [])
                    .map(q => q.qualification)
                    .join(" | "),

            qualificationCount:
                (eligibility.qualifications || []).length,

            minimumAge: age.minimumAge || null,

            maximumAge: age.maximumAge || null,

            salary:
                salary.payScale ||
                salary.basicPay ||
                ""

        },

    };

};