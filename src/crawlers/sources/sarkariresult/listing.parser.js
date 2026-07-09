const cheerio = require("cheerio");
const { BASE_URL } = require("./constants");

const SECTION_MAP = {
    "Latest Jobs": "latest_job",
    "Admit Card": "admit_card",
    "Results": "result",
    "Answer Key": "answer_key",
    "Admission": "admission",
    "Syllabus": "syllabus",
};

const normalizeUrl = (url) => {
    if (!url) return null;

    if (url.startsWith("/")) {
        return BASE_URL + url;
    }

    return url;
};

const parseListingPage = (html) => {
    const $ = cheerio.load(html);

    const jobs = [];
    const visited = new Set();

    Object.entries(SECTION_MAP).forEach(([heading, section]) => {
        $("b").each((_, element) => {
            const text = $(element).text().trim();

            if (text !== heading) return;

            const table = $(element).closest("table");

            table.find("a").each((_, a) => {
                const title = $(a).text().trim();

                let url = normalizeUrl($(a).attr("href"));

                if (!title || !url) return;

                if (visited.has(url)) return;

                visited.add(url);

                jobs.push({
                    title,
                    url,
                    section,
                });
            });
        });
    });

    return jobs;
};

module.exports = {
    parseListingPage,
};