require('dotenv').config();
const YTSearch = require('youtube-search');

const opts = {
    maxResults: process.env.YOUTUBE_MAX_RESULTS || 5,
    key: process.env.YOUTUBE_API_KEY,
    type: 'video'
};

function search(searchTerm, callback) {
    YTSearch(searchTerm, opts, (err, results) => {
        if (err || results.length == 0) {
            callback(new Error('No video found.'));
        }
        else {
            callback(null, results.map(((res) => res["link"])));
        }
    });
}

module.exports = {
    search: search
}
