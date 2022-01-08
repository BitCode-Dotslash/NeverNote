console.log("Content Script at Work");

// var automate;

// chrome.storage.sync.get(["automate"], function (result) {
//   automate = result.automate;
// });

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
        $("#selectedText").addClass("single-word");
        $("#extension #meaningButton").css("display", "block");
    } else {
        $("#extension #meaningButton").css("display", "none");
        $("#selectedText").removeClass("single-word");
    }
}

//function to add translate button activity
function translateButtonActivity(text) {
    $("#extension #translateTextButton").on("click", function () {
        $("#extension #translateDiv").css("display", "block");
        $("#extension #addToNotesDiv").css("display", "none");
        $("#extension #meaningDiv").css("display", "none");
        $("#translateTextButton").addClass("active child-dialog");
        $("#meaningButton").removeClass("active child-dialog");
        $("#speechButton").removeClass("active child-dialog");
        $("#addToNotes").removeClass("active child-dialog");
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
    $("#translateTextButton").removeClass("active child-dialog");
    $("#meaningButton").removeClass("active child-dialog");
    $("#addToNotes").removeClass("active child-dialog");
    $("#speechButton").addClass("active child-dialog");
    $("#extension #speechButton").on("click", async function () {
        textToSpeechAPI(text);
    });
}

function addToNotesButtonActivity(text) {
    $("#extension #addToNotes").on("click", function () {
        $("#extension #translateDiv").css("display", "none");
        $("#extension #addToNotesDiv").css("display", "block");
        $("#extension #meaningDiv").css("display", "none");
        console.log("Fetched");
        var container = $("#extension #addToNotesDiv #noteslist");
        $("#translateTextButton").removeClass("active child-dialog");
        $("#meaningButton").removeClass("active child-dialog");
        $("#addToNotes").addClass("active child-dialog");
        $("#speechButton").removeClass("active child-dialog");
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
    $("#extension #translateDiv").css("display", "none");
    $("#extension #addToNotesDiv").css("display", "none");
    $("#extension #meaningDiv").css("display", "block");
    $("#translateTextButton").removeClass("active child-dialog");
    $("#speechButton").removeClass("active child-dialog");
    $("#meaningButton").addClass("active child-dialog");
    $("#addToNotes").removeClass("active child-dialog");
    callMeaningAPI(word)
        .then((meaning) => {
            var meaningDiv = document.createElement("div");
            console.log(meaning.word);
            if (meaning.word) {
                $("#extension #meaningDiv #meaningNotFound").css(
                    "display",
                    "none"
                );
                $("#extension #meaningDiv #meaningFound").css(
                    "display",
                    "block"
                );

                let container = document.createElement("div");

                container.innerHTML = `<b>Root Word : </b>${meaning.word}`;

                $("#extension #meaningDiv #selectedWord").append(container);

                var currentWord = {
                    word: meaning.word,
                    meanings: [],
                };

                meaning = meaning.meanings;
                console.log(meaning);

                meaning.forEach((item) => {
                    console.log(item);
                    var container = document.createElement("div");

                    var partOfSpeech = document.createElement("p");
                    partOfSpeech.innerHTML =
                        "<span><b>Part of Speech:</b> " +
                        item.partOfSpeech +
                        "</span>";
                    container.appendChild(partOfSpeech);

                    var def = document.createElement("p");
                    def.innerHTML =
                        "<span><b>Meaning:</b> " +
                        item.definitions[0].definition +
                        "</span>";
                    container.appendChild(def);
                    var synonym = document.createElement("p");
                    let splitArray = item.definitions[0].synonyms.splice(4, 4);

                    synonym.innerHTML =
                        "<span><b>Synonym:</b> " + splitArray + "</span>";
                    container.appendChild(synonym);

                    var Antonym = document.createElement("p");
                    Antonym.innerHTML =
                        "<span><b>Antonym:</b> " +
                        item.definitions[0].antonyms +
                        "</span>";
                    container.appendChild(Antonym);

                    var example = document.createElement("p");
                    example.innerHTML =
                        "<span><b>Examples:</b> " +
                        item.definitions[0].example +
                        "</span>";
                    container.appendChild(example);

                    currentWord.meanings.push({
                        partOfSpeech: item.partOfSpeech,
                        definitions: {
                            meaning: item.definitions[0].definition,
                            synonyms: item.definitions[0].synonyms,
                            antonyms: item.definitions[0].antonyms,
                            examples: item.definitions[0].example,
                        },
                    });

                    meaningDiv.appendChild(container);
                });

                $("#extension #meaningDiv #meaningFound").html(meaningDiv);
                $("#extension #meaningDiv #addToVocab").css("display", "block");
                chrome.storage.sync.set({ currentWord: currentWord });
            } else {
                $("#extension #meaningDiv #meaningFound").css(
                    "display",
                    "none"
                );
                $("#extension #meaningDiv #addToVocab").css("display", "none");
                $("#extension #meaningDiv #meaningNotFound").css(
                    "display",
                    "block"
                );
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

//function to add meaning button activity
function meaningButtonActivity(text) {
    $("#extension #meaningButton").on("click", function () {
        $("#extension #translateDiv").css("display", "none");
        displayMeaning(text);
        $("#extension #meaningDiv").css("display", "block");

        $("#extension #meaningDiv #addToVocab").on("click", function () {
            chrome.storage.sync.get(["currentWord"], function (wordResult) {
                chrome.storage.sync.get(
                    ["vocab"],
                    async function (vocabResult) {
                        var vocab = vocabResult.vocab;
                        console.log(vocab);
                        var currentWord = wordResult.currentWord;
                        console.log(currentWord);
                        vocab.push(currentWord);
                        console.log(vocab);
                        await chrome.storage.sync.set({ vocab: vocab });
                    }
                );
            });
        });
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
