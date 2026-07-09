const axios = require("axios");

const {
    REQUEST_TIMEOUT,
    USER_AGENT,
    MAX_RETRIES,
    RETRY_DELAY,
} = require("./constants");

const delay = require("./delay");

const client = axios.create({
    timeout: REQUEST_TIMEOUT,
    headers: {
        "User-Agent": USER_AGENT,
    },
});

const fetchHtml = async (url) => {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            const response = await client.get(url);

            return response.data;
        } catch (err) {
            attempt++;

            if (attempt >= MAX_RETRIES) {
                throw err;
            }

            await delay(RETRY_DELAY);
        }
    }
};

module.exports = {
    fetchHtml,
};