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

module.exports.mapJob = function (detail) {

    //--------------------------------
    // Extract Sections
    //--------------------------------

    const sections = parseSections(detail);


    //--------------------------------
    // Parse Data
    //--------------------------------

    const basic = parseBasic(detail);

    const dates = parseDates(sections.dates || "");

    const links = parseLinks(detail);

    const vacancy = parseVacancies(detail);
    const eligibility = parseEligibility(detail);

    const age = parseAge(sections.age || "");

    const fee = parseFee(sections.fee || "");

    const selection = parseSelection(sections.selection || "");

    const salary = parseSalary(sections.salary || "");

    detail.tables.forEach((table, index) => {
        console.log("\n==============================");
        console.log("TABLE:", index);
    
        table.rows.forEach((row) => {
            console.log(
                row.map(cell => cell.text).join(" | ")
            );
        });
    });

    //--------------------------------
    // Final Object
    //--------------------------------

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

        ...links,

        ...vacancy,

        ...eligibility,

        ...age,

        ...fee,

        ...selection,

        // IMPORTANT
        salary: salary,

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

            qualification: vacancy.qualification || "",

            minimumAge: age.minimumAge || null,

            maximumAge: age.maximumAge || null,

            salary:
                salary.payScale ||
                salary.basicPay ||
                ""

        },

        //--------------------------------
        // Search
        //--------------------------------

        searchKeywords: [
            basic.title,
            basic.organization,
            basic.state,
            vacancy.qualification,
            ...(vacancy.vacancies || []).map(v => v.postName)
        ]
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
        
                detail.section,
        
                "Government Job",
        
                "Latest Jobs",
        
                "Govt Jobs"
        
            ]
                .filter(Boolean)
                .map(v => v.trim())
                .filter((v, i, arr) => arr.indexOf(v) === i)
        
        }

    };

};