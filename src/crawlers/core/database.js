const Job = require("../../models/Job");

const saveJob = async (payload) => {
    return await Job.findOneAndUpdate(
        {
            sourceUrl: payload.sourceUrl,
        },
        payload,
        {
            new: true,
            upsert: true,
            runValidators: true,
        }
    );
};

module.exports = {
    saveJob,
};