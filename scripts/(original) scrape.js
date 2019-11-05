var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("https://www.nytimes.com", function(err, res, body) {
        var $ = cheerio.load(body);
        
        /* console.log("scrape.js -> $: ", $); */
        console.log("scrape.js -> $('.theme-summary'): ", $(".theme-summary").each());

        var articles = [];

        $ (".theme-summary").each( function(i, element) {

            console.log("scrape.js -> i: ", i);
            console.log("scrape.js -> element: ", element);
            console.log("scrape.js -> this: ", this);
            var head = $(this).children(".story-heading").text().trim();
            var sum = $(this).children(".summary").text().trim();
            
            console.log("head: ", head);

            if(head && sum) {
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };

                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;
