console.log("Content Script at Work");

//function to create extension container to display
async function createExtensionContainer() {
    //create container
    console.log("add container");
    var extensionContainer = document.createElement("div");
    extensionContainer.id = "extensionContainer";
    extensionContainer.style.cssText =
        "position:absolute;top:0;right:0;width:auto;height:auto;opacity:1;z-index:1000000;background-color:pink;";
    document.body.appendChild(extensionContainer);

    return new Promise(async (resolve, reject) => {
        try {
            //get HTML data
            console.log("add container data");
            var htmlURL = chrome.runtime.getURL("/src/content/content.html");
            var htmlContent = await $.get(htmlURL);
            $("#extensionContainer").html(htmlContent);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

//function to display search Dictionary button or not
function displaySearchDictionaryButton(isWord) {
    if (isWord) {
        $("#extension #meaningButton").css("display", "block");
        $("#selectedText").addClass("single-word");
    } else {
        $("#extension #meaningButton").css("display", "none");
        $("#selectedText").removeClass("single-word");
    }
}

//function to add translate button activity
function translateButtonActivity(text) {
    $("#extension #translateTextButton").on("click", function () {
        $("#extension #translateDiv").css("display", "block");
        $("#extension #meaningDiv").css("display", "none");
    });

    $(
        "#extension #translateDiv #selectLanguage #languageSelectionForm #translateTextSubmit"
    ).on("click", function (event) {
        event.preventDefault();

        var translateFrom = $(
            "#extension #translateDiv #selectLanguage #languageSelectionForm #translate_from"
        ).val();

        var translateTo = $(
            "#extension #translateDiv #selectLanguage #languageSelectionForm #translate_to"
        ).val();

        if (translateTo !== "")
            callTranslateAPI(translateFrom, translateTo, text).then(
                (translatedText) => {
                    $("#extension #translateDiv #translatedText").html(
                        `Translated Text : ${translatedText}`
                    );
                }
            );
        else {
            alert("Select valid language");
        }
    });
}

//function to enable text to speech on click speech button
function speechButtonActivity(text) {
    $("#extension #speechButton").on("click", async function () {
        textToSpeechAPI(text);
    });
}

function addToNotesButtonActivity(text) {
    $("#extension #addToNotes").on("click", function () {
        console.log("Fetched");
        var container = $("#extension #addToNotesDiv #noteslist");
        chrome.storage.sync.get(["notes"], function (result) {
            var notes = Object.keys(result.notes);

            notes.forEach((notebook) => {
                container.append(new Option(notebook, notebook));
            });

            $("#extension #addToNotesDiv").css("display", "block");
        });
    });
}

function saveToNotes(text) {
    $("#extension #addToNotesDiv #notesSelectionForm").submit(function (event) {
        event.preventDefault();
        var selectedNotebook = $(
            "#extension #addToNotesDiv #notesSelectionForm #select_note"
        ).val();
        console.log(selectedNotebook);
        chrome.storage.sync.get(["notes"], function (result) {
            var notes = result.notes;
            console.log(notes);
            var notebookContent = notes[selectedNotebook];
            console.log(typeof notebookContent);
            console.log(notebookContent);
            notebookContent.push(text);
            console.log(notebookContent);
            notes[selectedNotebook] = notebookContent;
            console.log(notes);
            chrome.storage.sync.set({ notes: notes });
        });
    });
}

//function to display meaning, antonym, synonym, and example of given word
async function displayMeaning(word) {
    var meaning = callMeaningAPI(word);
    var synonym = callSynonymAPI(word);
    var antonym = callAntonymAPI(word);
    var example = callExampleAPI(word);

    console.log(word, meaning, synonym, antonym);
    $("#extension #meaningDiv #selectedWord").text(word);
    $("#extension #meaningDiv #wordMeaning").text(meaning);
    $("#extension #meaningDiv #wordSynonym").text(synonym);
    $("#extension #meaningDiv #wordAntonym").text(antonym);
    $("#extension #meaningDiv #wordExamples").text(example);

    var currentWord = {
        word: word,
        meaning: meaning,
        synonym: synonym,
        antonym: antonym,
        example: example,
    };

    await chrome.storage.sync.set({ currentWord: currentWord });
}

//function to add meaning button activity
function meaningButtonActivity(text) {
    $("#extension #meaningButton").on("click", function () {
        $("#extension #translateDiv").css("display", "none");
        $("#extension #meaningDiv").css("display", "block");
        displayMeaning(text);
    });
}

// display container on right side on ctrl + Selection event
$(document).mouseup(async function (event) {
    if ((event.ctrlKey || event.metaKey) && window.getSelection) {
        console.log("Detected selection with ctrl key");

        //get selected text
        var selectedText = window.getSelection().toString();
        selectedText = selectedText.trim();
        console.log(selectedText);

        //check for whether text is single word or not
        var isWord = selectedText.split(" ").length == 1;

        //create display container
        createExtensionContainer()
            .then(() => {
                //add selected text to the container
                console.log("containerAdded");

                displaySearchDictionaryButton(isWord);
                translateButtonActivity(selectedText);
                meaningButtonActivity(selectedText);
                speechButtonActivity(selectedText);
                addToNotesButtonActivity(selectedText);
                saveToNotes(selectedText);
                $("#extension #selectedText").html(selectedText);
                console.log($("#extension"));
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

//remove extension container when user clicks outside the div
$(document).mousedown(function (event) {
    var container = $("#extensionContainer");

    // if the target of the click isn't the container nor a descendant of the container
    if (
        !container.is(event.target) &&
        container.has(event.target).length === 0
    ) {
        container.remove();
    }
});
