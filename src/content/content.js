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


  $("#extension #translateDiv #selectLanguage #languageSelectionForm").submit(
    function (event) {
      event.preventDefault();

      var translateFrom = $(
        "#extension #translateDiv #selectLanguage #languageSelectionForm #translate_from"
      ).val();

      var translateTo = $(
        "#extension #translateDiv #selectLanguage #languageSelectionForm #translate_to"
      ).val();

      callTranslateAPI(translateFrom, translateTo, text).then((translatedText) => {
        $("#extension #translateDiv #translatedText").html(translatedText);
      })

    }
  );
}


//function to enable text to speech on click speech button
function speechButtonActivity(text){
    $("#extension #speechButton").on("click", async function(){
        textToSpeechAPI(text);
    })
}

//function to display meaning, antonym, synonym, and example of given word
async function displayMeaning(word) {
    callMeaningAPI(word).then((meaning) => {
        var meaningDiv = document.createElement("div");
        console.log(meaning.word);
        if(meaning.word){
            $("#extension #meaningDiv #meaningNotFound").css("display", "none");
            $("#extension #meaningDiv #meaningFound").css("display", "block");
            $("#extension #meaningDiv #selectedWord").text(meaning.word);
            meaning = meaning.meanings;
            console.log(meaning);
            meaning.forEach((item) => {
                console.log(item);
                var container = document.createElement("div");

                var partOfSpeech = document.createElement("p");
                partOfSpeech.innerHTML = "<span>Part of Speech:" + item.partOfSpeech +"</span>";
                container.appendChild(partOfSpeech);

                console.log(item.definitions[0]);
                var def = document.createElement("p");
                def.innerHTML = "<span>Meaning: " + item.definitions[0].definition +"</span>";
                container.appendChild(def);

                var synonym = document.createElement("p");
                synonym.innerHTML = "<span>Synonym: " + item.definitions[0].synonyms +"</span>";
                container.appendChild(synonym);

                var Antonym = document.createElement("p");
                Antonym.innerHTML = "<span>Antonym: " + item.definitions[0].antonyms +"</span>";
                container.appendChild(Antonym);

                var example = document.createElement("p");
                example.innerHTML = "<span>Examples: " + item.definitions[0].example +"</span>";
                container.appendChild(example);

                meaningDiv.appendChild(container);
            })

            $("#extension #meaningDiv #meaningFound").html(meaningDiv);
        }else{
            $("#extension #meaningDiv #meaningFound").css("display", "none");
            $("#extension #meaningDiv #meaningNotFound").css("display", "block");
        }

    }).catch((err) => {
        console.log(err);
    });
    
    

    // console.log(word, meaning, synonym, antonym);
    
    // $("#extension #meaningDiv #wordMeaning").text(meaning);
    // $("#extension #meaningDiv #wordSynonym").text(synonym);
    // $("#extension #meaningDiv #wordAntonym").text(antonym);
    // $("#extension #meaningDiv #wordExamples").text(example);


    // var currentWord = {
    //     word: word,
    //     meaning: meaning,
    //     synonym: synonym,
    //     antonym: antonym,
    //     example: example
    // };

    // await chrome.storage.sync.set({currentWord: currentWord});
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
