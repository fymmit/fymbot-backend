const YTSearch = require('youtube-search');

// TODO: Implement function.
function search(searchTerm, callback) {

    // successful search:
    callback(null, videoUrl);

    // unsuccessful search:
    callback(new Error('No video found.'));
}

module.exports = {
    search: search
}
