require("dotenv").config();

const connectDB = require("../config/db");

const { crawlSections } = require("../crawlers/sources/sarkariresult");

const {
    parseListingPage,
} = require("../crawlers/sources/sarkariresult/listing.parser");

const {
    getDetailPage,
} = require("../crawlers/sources/sarkariresult/detail.parser");

const {
    mapJob,
} = require("../crawlers/sources/sarkariresult/mapper");

const shouldImport = require("../utils/shouldImport");
const detectDepartment = require("../utils/detectDepartment");

const Job = require("../models/Job");
const Category = require("../models/Category");
const Department = require("../models/Department");

const slugify = require("slugify");
const crypto = require("crypto");

async function start() {
    try {

        await connectDB();

        console.log("✅ MongoDB Connected");

        const pages = await crawlSections();

        for (const page of pages) {

            console.log(`\n==============================`);
            console.log(`Checking ${page.section}`);
            console.log(`==============================`);

            const notifications = parseListingPage(page);

            let consecutiveExisting = 0;
            let imported = 0;

            for (const notification of notifications) {

                const exists = await Job.exists({
                    sourceUrl: notification.url,
                });

                if (exists) {

                    consecutiveExisting++;

                    console.log(
                        `⏭ Existing (${consecutiveExisting}/5) : ${notification.title}`
                    );

                    if (consecutiveExisting >= 5) {

                        console.log(
                            `Stopping ${page.section} - reached existing notifications`
                        );

                        break;
                    }

                    continue;
                }

                // Reset counter because a new notification was found
                consecutiveExisting = 0;

                console.log(`🆕 ${notification.title}`);

                const detail = await getDetailPage(notification);

                if (!detail) {
                    console.log("❌ Detail page failed");
                    continue;
                }

                const job = mapJob(detail);

                job.slug =
                    slugify(job.title, {
                        lower: true,
                        strict: true,
                    }) +
                    "-" +
                    crypto
                        .createHash("md5")
                        .update(job.sourceUrl)
                        .digest("hex")
                        .slice(0, 8);

                if (!shouldImport(job)) {
                    console.log("⏭ Filtered");
                    continue;
                }

                const category = await Category.findOne({
                    slug: job.displaySection.replace("_", "-"),
                });

                if (!category) {
                    console.log("❌ Category Missing");
                    continue;
                }

                const department = await Department.findOne({
                    name: detectDepartment(job.organization),
                });

                if (!department) {
                    console.log("❌ Department Missing");
                    continue;
                }

                await Job.findOneAndUpdate(
                    {
                        sourceUrl: job.sourceUrl,
                    },
                    {
                        ...job,
                        category: category._id,
                        department: department._id,
                        source: "CRAWLER",
                        crawlStatus: "SUCCESS",
                        lastCrawledAt: new Date(),
                    },
                    {
                        upsert: true,
                        new: true,
                    }
                );

                imported++;

                console.log(`✅ Imported : ${job.title}`);
            }

            console.log(
                `Finished ${page.section}. Imported ${imported} new notifications.`
            );
        }

        console.log("\n🎉 Update Completed");

    } catch (err) {

        console.error(err);

    } finally {

        process.exit();

    }
}

start();