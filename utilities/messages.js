const moment = require('moment');

const formatMessage = (username, text) => {
    return {
        username,
        text,
        date: moment().format('MM/DD/YYYY'),
        time: moment().format('h:mm a')
    }
};

module.exports = formatMessage;