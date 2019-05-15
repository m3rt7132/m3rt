var request = require("request");
var cheerio = require("cheerio");
var songs = [];


function getSongs(chart, callback) {
    request(chart, function(err, resp, body) {
        if (!err && resp.statusCode === 200) {
            var $ = cheerio.load(body);
            var rank = 1;
            $('.chart-row__primary', '.js-chart-data').each(function() {
                var title = $(this).find('h2.chart-row__song').text();
                var artist = $(this).find('a.chart-row__artist').text().trim();
                var image = $(this).find('div.chart-row__image').data('imagesrc');
                var spotify = $(this).find('a.js-spotify-play-full').data('href');

                if (image == null) {
                    image = $(this).find('.chart-row__image').css('background-image');

                    if (image !== undefined) {
                        image = image.substring(4, image.length - 1);
                    } else {
                        image = "http://www.billboard.com/static/frontend/2016_04_28_1601/assets/images/chart-row-placeholder.jpg";
                    }
                }

                var song = {
                    rank: rank,
                    title: title,
                    artist: artist,
                    image: image,
                    spotify: spotify
                };

                songs.push(song);
                rank++;
            })

            return callback(songs);
        }
    });
}

module.exports.getSongs = getSongs;