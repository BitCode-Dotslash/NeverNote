
// display create notebook section on click create notebook button
$("#createNotebook").on("click", function(){
    $("#createNotebookDiv").css("display", "block");
    $("#createNotebookDiv #createNotebookForm button").prop("disabled", true);
})


//check for valid notebook name (unique name)
$("#createNotebookDiv input#notebookName").keyup(function(){
    var inputText = $(this).val();
    // console.log(inputText);
    chrome.storage.sync.get(['notes'], function(result) {
        var notebooks = Object.keys(result.notes);
        var found = notebooks.indexOf(inputText);
        // console.log(found);
        if(found==-1){
            $("#createNotebookDiv input#notebookName").css({"border": "5px solid green"});
            $("#createNotebookDiv input#notebookName").css({"background-color": "green"});
            $("#createNotebookDiv #createNotebookForm button").prop("disabled", false);
            // console.log("undefined");
        }else{
            $("#createNotebookDiv input#notebookName").css({"border": "5px solid red"});
            $("#createNotebookDiv input#notebookName").css({"background-color": "red"});
            $("#createNotebookDiv #createNotebookForm button").prop("disabled", true);
            // console.log("defined");
        }
    })
});


//create notebook form submit event
$("#createNotebookDiv #createNotebookForm").submit(function(event){
    event.preventDefault();
    var newNotebook = $("#createNotebookDiv input#notebookName").val();
    $(this).closest('form').find("input[type=text], textarea").val("");
    $("#createNotebookDiv").css("display", "none");
    chrome.storage.sync.get(['notes'], function(result){
        var notes = result.notes;
        notes[newNotebook] = [];
        chrome.storage.sync.set({notes: notes});
    })
})