$(document).ready(function() {
    var articleContainer = $(".article-container");
    
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initPage();
  
    function initPage() {      
      articleContainer.empty();
      $.get("/api/headlines?saved=true").then(function(data) {
        
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
        //articleCards.push(createCard(articles[i]));
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
            "<a class='btn btn-danger delete'>",
            "Delete From Saved",
            "</a>",
            "<a class='btn btn-info notes'> Article Notes</a>",
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
          "<h3>Would You Like to Browse Available Articles??</h3>",
          "</div>",
          "<div class='panel-body text-center'>",
          "<h4><a href='/'>Browse Articles</a></h4>",
          "</div>",
          "</div>"
        ].join(""));
      articleContainer.append(emptyAlert);
    }
  
    function handleArticleDelete() {
        var articleToDelete = $(this).parents(".panel").data();

        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
            if(data.ok) {
                init.page();
            }
        });
    }
  
    function handleArticleNotes() {
        var currentArticle = $(this).parents(".panel").data();

        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes For Article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");

            bootbox.dialog({
                message: modalText,
                closeButton: true
            });

            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };

            $(".btn.save").data("article", noteData);

            renderNotesList(noteData);
        });
    }
  
    function handleArticleClear() {
      $.get("api/clear").then(function() {
        articleContainer.empty();
        initPage();
      });
    }

    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if(!data.notes.length) {
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        } else {
            for(var i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

    function handleNoteSave() {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                notetext: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("_id");

        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            bootbox.hideAll();
        });
    }

});
  