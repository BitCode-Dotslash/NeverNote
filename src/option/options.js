chrome.storage.sync.get(["vocab"], function (result) {
    var vocab = result.vocab;

    var dictionaryDiv = document.createElement("div");
    vocab.forEach((element) => {
        console.log(element);
        var wordDiv = document.createElement("div");
        wordDiv.classList.add('container')

        wordDiv.innerHTML = `<p style="margin:1vh;font-size:20px"><b >${element.word}</b></p>`

        var meaningDiv = document.createElement("div");

        console.log(element.meanings);
        element.meanings.forEach((item) => {
            console.log(item);
            var container = document.createElement("div");
            container.classList.add("meaning-container", "ms-4", "mb-2");

            var partOfSpeech = document.createElement("div");
            partOfSpeech.classList.add("ms-3");
            partOfSpeech.innerHTML = "<i> " + item.partOfSpeech + "</i>";
            container.appendChild(partOfSpeech);

            var innerContainer = document.createElement("div");
            innerContainer.classList.add("meaning-inner-container");
            var def = document.createElement("div");
            def.innerHTML =
                "<span ><b>Meaning:</b> " + item.definition + "</span>";
            innerContainer.appendChild(def);
            var synonym = document.createElement("div");
            let splitArray = item.synonyms.splice(
                0,
                Math.min(4, item.synonyms.length)
            );
            if (splitArray.length > 0) {
                synonym.innerHTML =
                    "<span ><b>Synonym:</b> " +
                    splitArray.join(", ") +
                    "</span>";
                innerContainer.appendChild(synonym);
            }
            if (item.antonyms.length > 0) {
                var Antonym = document.createElement("div");
                Antonym.innerHTML =
                    "<span ><b>Antonym:</b> " +
                    item.antonyms.join(", ") +
                    "</span>";
                innerContainer.appendChild(Antonym);
            }
            if (item.example) {
                var example = document.createElement("div");
                example.innerHTML =
                    "<span ><b>Examples:</b> " + item.example + "</span>";
                innerContainer.appendChild(example);
            }

            container.appendChild(innerContainer);
            meaningDiv.appendChild(container);
        });

        wordDiv.appendChild(meaningDiv);

        dictionaryDiv.appendChild(wordDiv);
    });

    $("#content").html(dictionaryDiv);
});
