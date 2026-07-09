const log = (...args) => {
    console.log(
        `[${new Date().toLocaleString()}]`,
        ...args
    );
};

const success = (...args) => {
    console.log(
        `[${new Date().toLocaleString()}] ✅`,
        ...args
    );
};

const error = (...args) => {
    console.error(
        `[${new Date().toLocaleString()}] ❌`,
        ...args
    );
};

module.exports = {
    log,
    success,
    error,
};