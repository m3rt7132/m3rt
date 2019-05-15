var wf = require('word-freq');
var speak = require('speakeasy-nlp');

function strip(str) {
    var stripped = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/ *\[[^\]]*]/g, "")
        .replace(/\n/g, " ")
        .toLowerCase();
    return stripped;
}

function sortObject(obj) {
    var arr = [];

    for (var prop in obj) {
        if (obj[prop]) arr.push({'word': prop,'count': obj[prop]});
    }

    arr.sort((a,b) => b - a);
    return arr;
}

function wordFreq(str) {
 return sortObject(wf.freq(strip(str), true, false));
}

function format(str) {
    var lyrics = str.split('\n');
    var sqBrackets = new RegExp(/^\[.*\]$/);
    var formatted = "";


    for (var line of lyrics) {
        if (!line.includes('googletag') && !sqBrackets.test(line) && line.length > 0) {
            formatted += line + '\n';
        }
    }

    return formatted.trim();
}

function sentiment(str) {
    return speak.sentiment.analyze(str);
}


module.exports.wordFreq = wordFreq;
module.exports.format = format;
module.exports.sentiment = sentiment;