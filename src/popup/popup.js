//print functionality on click buttons
function printFunctionality(){
    $("#downloadNotebookDiv button").on("click", function (event) {
        console.log(event);
        console.log(event.target.id);
        var notebook = event.target.id;
        chrome.storage.sync.get(['notes'], function(result) {
            var notes = result.notes;
            var notebookContent = notes[notebook];
            console.log(notebookContent);

            const doc = new jsPDF();

            doc.setFillColor(221, 221, 221);
            doc.setLineWidth(1.5);
            doc.rect(0, 0, 220, 60, "F");
            doc.addImage(imgData, 'PNG', 20, 6, 46, 46);

            doc.setLineWidth(1);
            doc.setDrawColor(117,53,53);
            doc.line(10, 60, 200, 60);

            doc.setFontSize(37);

            doc.setFont('helvetica');
            doc.setFontType('bold');
            doc.text(notebook.charAt(0).toUpperCase() + notebook.slice(1), 190, 28, "right");

            doc.setFontSize(17);
            doc.setFont('times');
            doc.setFontType('italic');

            var script = notebookContent.join("\r\n\r\n");

            doc.setFontSize(16);
            var splitText = doc.splitTextToSize(script, 170);

            var y = 70;

            for (var i = 0; i < splitText.length; i++) {
                if (y > 280) {
                    y = 10;
                    doc.addPage();
                }
                var res = splitText[i].split(":");

                if (res.length > 1) {
                    y = y + 5;
                    var name = res[0].concat(" :");
                    var width = doc.getTextWidth(name);
                    var conversation = res[1];

                    doc.setFontType('bold');
                    doc.text(10, y, name);
                    doc.setFontType('normal');
                    doc.text(15 + width, y, conversation);
                } else {
                    doc.text(30, y, splitText[i]);
                }
                y = y + 7;
            }

            doc.save(notebook + ".pdf");

        })
    })
}



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

        printFunctionality();

    })
})
