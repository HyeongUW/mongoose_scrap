$(document).ready(function() {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    initPage();
  
    function initPage() {      
      articleContainer.empty();  
      $.get("/api/headlines?saved=false").then(function(data) {
        
        if (data && data.length) {
          renderArticles(data);
        } else {
          renderEmpty();
        }
      });
    }
  
    function renderArticles(articles) {
      var articlePanels = [];

      for (var i = 0; i < articles.length; i++) {
        //articlePanels.push(createCard(articles[i]));
        articlePanels.push(createPanel(articles[i]));
      }

      articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        var panel = 
        $(["<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            article.headline,
            "<a class='btn btn-success save'>",
            "Save Article",
            "</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
          ].join(""));
        panel.data("_id", article._id);
        return panel;
    }    
  
/*     function createCard(article) {
      // This function takes in a single JSON object for an article/headline
      // It constructs a jQuery element containing all of the formatted HTML for the
      // article card
      var card = $("<div class='card'>");
      var cardHeader = $("<div class='card-header'>").append(
        $("<h3>").append(
          $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
            .attr("href", article.url)
            .text(article.headline),
          $("<a class='btn btn-success save'>Save Article</a>")
        )
      );
  
      var cardBody = $("<div class='card-body'>").text(article.summary);
  
      card.append(cardHeader, cardBody);
      // We attach the article's id to the jQuery element
      // We will use this when trying to figure out which article the user wants to save
      card.data("_id", article._id);
      // We return the constructed card jQuery element
      return card;
    } */
  
    function renderEmpty() {
      var emptyAlert = $(
        [
          "<div class='alert alert-warning text-center'>",
          "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
          "</div>",
          "<div class='panel panel-default'>",
          "<div class='panel-heading text-center'>",
          "<h3>What Would You Like To Do?</h3>",
          "</div>",
          "<div class='panel-body text-center'>",
          "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
          "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
          "</div>",
          "</div>"
        ].join(""));
      articleContainer.append(emptyAlert);
    }
  
    function handleArticleSave() {
      var articleToSave = $(this).parents(".panel").data();
      /* console.log(articleToSave); */
      articleToSave.saved = true;

      $.ajax({
        method: "PATCH",
        url: "/api/headlines",
        data: articleToSave

      }).then(function(data) {
        if (data.ok) {
          initPage();
        }
      });
    }
  
    function handleArticleScrape() {
      $.get("/api/fetch").then(function(data) {
        /* console.log("handleArticleScrape initiated"); */
        initPage();
        bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
      });
    }
  
    function handleArticleClear() {
      $.get("api/clear").then(function() {
        articleContainer.empty();
        initPage();
      });
    }
});
  