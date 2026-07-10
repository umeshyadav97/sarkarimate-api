const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Department = require("../models/Department");
const slugify = require("slugify");

dotenv.config();

const departments = [
    "SSC",
    "UPSC",
    "Railway",
    "IBPS",
    "SBI",
    "MPPSC",
    "UPPSC",
    "BPSC",
    "RPSC",
    "HPSC",
    "JPSC",
    "Police",
    "Army",
    "Navy",
    "Air Force",
    "Teaching",
    "High Court",
    "District Court",
    "State Government",
    "Central Government",
    "Other"
];

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const name of departments) {
        await Department.updateOne(
            { name },
            {
                $setOnInsert: {
                    name,
                    slug: slugify(name, {
                        lower: true,
                        strict: true,
                    }),
                },
            },
            { upsert: true }
        );
    }

    console.log("✅ Departments Seeded");

    process.exit();
})();