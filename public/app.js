// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    //$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    
    
    let newsItemDiv = $("<div data-_id='" + data[i]._id + "'>").addClass("card");
    
    //Working on card-header
    let link = "https://www.nytimes.com" + data[i].link
    let cardHeaderDiv = $("<div data-_id='" + data[i]._id + "'>").addClass("card-header").append("<h3>  <a class='article-link' target='_blank' rel='noopener noreferer' href='" + link + "'>" + data[i].title + "</a> <a class='btn btn-success save'>Save Article</a> </h3>");
    newsItemDiv.append(cardHeaderDiv);

    //Working on card-body
    let cardBodyDiv = $("<div class='card-body'>" + data[i].summary  + "</div>")
    newsItemDiv.append(cardBodyDiv);

    //$("#articles").append("<div data-_id='" + data[i]._id);
    $("#articles").append(newsItemDiv);
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".card-header", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-_id");
  console.log("this.note: ", this);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log("data: ", data);
      //console.log("data.title: ", data.title);

      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-_id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      console.log("data.note: ", data.note);
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-_id");
  
  //console.log("Save Note => this : ", this);
  //console.log("thisID: ", thisId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log("Save Data: ", data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
