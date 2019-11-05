var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");

var scrape = function (cb) {
    /* request("https://www.nytimes.com", function(err, res, body) {
        var $ = cheerio.load(body);
        
        console.log("scrape.js -> $: ", $);
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
    }); */


    // Try scraping from a different source-----

    // 1. using previous example to scrap from Reddit
    axios.get("https://old.reddit.com/r/webdev/").then(function(response) {
        var $ = cheerio.load(response.data);
        var articles = [];
      
        $("p.title").each(function(i, element) {
          var title = $(element).text();
          var link = $(element).children().attr("href");
          
          var dataToAdd = {
            headline: title,
            summary: link
          };          

          articles.push(dataToAdd);
        });
      
        //---------------------------
        console.log(articles);
        cb(articles);
        
    });

    // 2. using previous example to edit scraping from NY Times
    /* axios.get("https://www.nytimes.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        var articles = [];

        

        $(".theme-summary").each( function(i, element) {

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
    }); */    

    //------------------------------------------


    
};

module.exports = scrape;
