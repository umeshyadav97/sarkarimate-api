const mongoose = require("mongoose");
const dotenv = require("dotenv");
const slugify = require("slugify");

const Department = require("../models/Department");
const SubCategory = require("../models/SubDepartment");

dotenv.config();

const data = {
    SSC: [
        "SSC CGL",
        "SSC CHSL",
        "SSC MTS",
        "SSC GD",
        "SSC JE",
        "SSC Stenographer",
    ],

    Railway: [
        "RRB NTPC",
        "RRB Group D",
        "RRB ALP",
        "RRB JE",
        "RPF",
    ],

    IBPS: [
        "IBPS PO",
        "IBPS Clerk",
        "IBPS SO",
        "IBPS RRB",
    ],

    SBI: [
        "SBI PO",
        "SBI Clerk",
        "SBI SO",
    ],

    UPSC: [
        "Civil Services",
        "Engineering Services",
        "CDS",
        "CAPF",
        "NDA",
    ],

    Army: [
        "Agniveer",
        "Technical Entry",
        "NCC Special Entry",
    ],

    Navy: [
        "SSR",
        "MR",
        "SSC Officer",
    ],

    "Air Force": [
        "AFCAT",
        "Agniveer Vayu",
        "X Group",
        "Y Group",
    ],
};

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const departmentName of Object.keys(data)) {

        const department = await Department.findOne({
            name: departmentName,
        });

        if (!department) {
            continue;
        }

        for (const name of data[departmentName]) {

            await SubCategory.updateOne(
                {
                    name,
                    department: department._id,
                },
                {
                    $setOnInsert: {
                        name,
                        slug: slugify(name, {
                            lower: true,
                            strict: true,
                        }),
                        department: department._id,
                    },
                },
                {
                    upsert: true,
                }
            );

        }

    }

    console.log("✅ Sub Categories Seeded");

    process.exit();
})();