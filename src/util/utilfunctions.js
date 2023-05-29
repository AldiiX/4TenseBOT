const moment = require("moment-timezone")

module.exports = {
    log: (message, type) => {
        const types = {
            alert: "\x1b[33m\x1b[1m",
            warn: "\x1b[33m",
            error: "\x1b[41m",
            success: "\x1b[32m\x1b[1m",
            announcement: "\x1b[36m"
        };

        console.log(`${type ? types[type] : ""} [${moment().tz('Europe/Prague').format("DD/MM/YYYY HH:mm:ss")}] ${message}\x1b[0m`);
    }
}