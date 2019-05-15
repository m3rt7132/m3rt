var lyrics = require("./lib/lyrics");
var charts = require("./lib/charts");
var analysis = require("./lib/analysis");

function getSong(query, callback) {
    lyrics.getSongLyrics(query, function(songObj) {
        songObj.frequency = analysis.wordFreq(songObj.lyrics);
        songObj.sentiment = analysis.sentiment(songObj.lyrics);
        return callback(songObj);
    });
}

function getBillboard(url, callback) {
    charts.getSongs(url, function(chart) {
        return callback(chart)
    });
}

module.exports.getSong = getSong;
module.exports.getBillboard = getBillboard;
module.exports.setToken = lyrics.setToken;