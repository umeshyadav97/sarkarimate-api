require("dotenv").config();

const connectDB = require("../config/db");

const {
    crawlSections,
} = require("../crawlers/sources/sarkariresult");

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
const Job = require("../models/Job");
const Category = require("../models/Category");
const Department = require("../models/Department");
const slugify = require("slugify");

const detectDepartment = require("../utils/detectDepartment");

async function start() {
    try {
        await connectDB();

        console.log("MongoDB Connected");

        // Download all sections
        const pages = await crawlSections();

        let notifications = [];

        for (const page of pages) {
            const items = parseListingPage(page);

            console.log(`✅ ${page.section} : ${items.length} notifications`);

            notifications.push(...items);
        }

        // Remove duplicate notifications
        const uniqueNotifications = [
            ...new Map(
                notifications.map((item) => [item.url, item])
            ).values(),
        ];

        console.log("\n==============================");
        console.log(`Unique Notifications : ${uniqueNotifications.length}`);
        console.log("==============================\n");

        // Import only latest 500 (optional)
        const notificationsToImport = uniqueNotifications.slice(0, 500);

        for (const notification of notificationsToImport) {

            console.log(`\nDownloading: ${notification.title}`);

            // Skip if already imported
            const exists = await Job.exists({
                sourceUrl: notification.url,
            });

            if (exists) {
                console.log("⏭ Already Imported");
                continue;
            }

            // Download detail page
            const detail = await getDetailPage(notification);

            // Convert to Job object
            const job = mapJob(detail);

            job.slug = slugify(job.title, {
                lower: true,
                strict: true,
            });

            // Skip old jobs
            if (!shouldImport(job)) {
                console.log(`⏭ Skipped ${job.title}`);
                continue;
            }

            // Find Category
            const category = await Category.findOne({
                slug: job.displaySection.replace("_", "-"),
            });

            if (!category) {
                console.log("❌ Category not found");
                continue;
            }

            // Find Department
            const department = await Department.findOne({
                name: detectDepartment(job.organization),
            });

            if (!department) {
                console.log("❌ Department not found");
                continue;
            }

            // Save Job
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
                    returnDocument: "after",
                }
            );

            console.log(`✅ Saved: ${job.title}`);
        }

        console.log("\n🎉 Import Completed");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

start();