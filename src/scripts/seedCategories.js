const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/Category");
const slugify = require("slugify");
dotenv.config();

const categories = [
    "Latest Job",
    "Admit Card",
    "Result",
    "Answer Key",
    "Syllabus",
    "Admission",
    "Scholarship",
    "Certificate",
    "Important",
    "Other"
];

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const name of categories) {
        await Category.updateOne(
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

    console.log("✅ Categories Seeded");

    process.exit();
})();