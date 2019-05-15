var request = require("request");
var cheerio = require("cheerio");
var analysis = require("./analysis");
var token;

function setToken(_token) {
    token = _token;
}

function getSongInfo(query, callback) {
    var encodedQuery = encodeURIComponent(query);
    var url = "http://api.genius.com/search?access_token=" + token + "&q=" + encodedQuery;

    request(url, function(err, resp, body) {
        if (!err && resp.statusCode === 200) {
            var hits = JSON.parse(body).response.hits;

            if (hits.length > 0) {
                var result = hits[0].result;

                return callback({
                    title: result.title,
                    artist: result.primary_artist.name,
                    url: result.url
                });
            } else {
                console.log("Warning: No songs were found for '" + query + "'");
            }
        } else {
            console.error("Error: Could not find song URL");
        }
    });
}

function getSongLyrics(query, callback) {
    getSongInfo(query, function(song) {
        request(song.url, function(err, resp, body) {
            if (!err && resp.statusCode === 200) {
                var $ = cheerio.load(body);
                var lyrics = $('p', '.lyrics').text().trim();
                song.lyrics = analysis.format(lyrics);
                return callback(song);
            } else {
                console.error("Error: Could not fetch song lyrics")
            }
        });
    });
}

module.exports.getSongLyrics = getSongLyrics;
module.exports.setToken = setToken;