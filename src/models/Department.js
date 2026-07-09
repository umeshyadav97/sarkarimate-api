const mongoose = require("mongoose");
const slugify = require("slugify");

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        slug: {
            type: String,
            unique: true
        },

        website: String,

        logo: String,

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

departmentSchema.pre("save", function (next) {

    if (this.isModified("name")) {

        this.slug = slugify(this.name, {
            lower: true,
            strict: true
        });

    }

    next();

});

module.exports = mongoose.model("Department", departmentSchema);