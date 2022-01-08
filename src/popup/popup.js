// display create notebook section on click create notebook button
$("#createNotebook").on("click", function () {
  $("#createNotebookDiv").css("display", "block");
  $("#downloadNotebookDiv").css("display", "none")
  $("#createNotebookDiv #createNotebookForm button").prop("disabled", true);
});

//check for valid notebook name (unique name)
$("#createNotebookDiv input#notebookName").keyup(function () {
  var inputText = $(this).val();
  // console.log(inputText);
  chrome.storage.sync.get(["notes"], function (result) {
    var notebooks = Object.keys(result.notes);
    var found = notebooks.indexOf(inputText);
    // console.log(found);
    if (found == -1) {
      $("#createNotebookDiv input#notebookName").css({
        border: "5px solid green",
      });
      $("#createNotebookDiv input#notebookName").css({
        "background-color": "green",
      });
      $("#createNotebookDiv #createNotebookForm button").prop(
        "disabled",
        false
      );
      // console.log("undefined");
    } else {
      $("#createNotebookDiv input#notebookName").css({
        border: "5px solid red",
      });
      $("#createNotebookDiv input#notebookName").css({
        "background-color": "red",
      });
      $("#createNotebookDiv #createNotebookForm button").prop("disabled", true);
      // console.log("defined");
    }
  });
});

//create notebook form submit event
$("#createNotebookDiv #createNotebookForm").submit(function (event) {
  event.preventDefault();
  var newNotebook = $("#createNotebookDiv input#notebookName").val();
  $(this).closest("form").find("input[type=text], textarea").val("");
  $("#createNotebookDiv").css("display", "none");
  chrome.storage.sync.get(["notes"], function (result) {
    var notes = result.notes;
    notes[newNotebook] = [];
    chrome.storage.sync.set({ notes: notes });
  });
});

chrome.storage.sync.get(["optionsUrl"], function (result) {
  $("#optionsButton").on("click", function () {
    chrome.tabs.create({
      url: result.optionsUrl,
    });
  });
});

$("#downloadNotebook").on("click", function(){
    chrome.storage.sync.get(['notes'], function(result){
        var notes = Object.keys(result.notes);
        console.log(notes.length);
        if(notes.length>0){
          console.log("notes Available");
            $("#noNotebooksFound").css("display", "none");
            var container = document.createElement("div");

            notes.forEach((notebook) => {
                var downloadLink = document.createElement("button");
                downloadLink.id = notebook;
                downloadLink.innerText = notebook;
                container.appendChild(downloadLink);
            })

            $("#downloadNotebookDiv").append(container);
        }else{
            console.log("No notes found");
            $("#noNotebooksFound").css("display", "block");
        }

        $("#downloadNotebookDiv").css("display", "block")
    })
})
