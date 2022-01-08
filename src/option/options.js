

chrome.storage.sync.get(['vocab'], function (result) {
    var vocab = result.vocab;
    
    var dictionaryDiv = document.createElement("div");
    vocab.forEach((element) => {

        console.log(element);
        var wordDiv = document.createElement("div");

        var wordPara = document .createElement("h1");
        wordPara.innerHTML = element.word;
        wordDiv.appendChild(wordPara);

        var meaningDiv = document.createElement("div");

        console.log(element.meanings);
        element.meanings.forEach((meaning) => {
            console.log(meaning);
            var container = document.createElement("div");

            var partOfSpeech = document.createElement("p");
            partOfSpeech.innerHTML = "<span>Part of Speech:" + meaning.partOfSpeech +"</span>";
            container.appendChild(partOfSpeech);

            
            var def = document.createElement("p");
            def.innerHTML = "<span>Meaning: " + meaning.definitions.meaning +"</span>";
            container.appendChild(def);

            var synonym = document.createElement("p");
            synonym.innerHTML = "<span>Synonym: " + meaning.definitions.synonyms +"</span>";
            container.appendChild(synonym);

            var Antonym = document.createElement("p");
            Antonym.innerHTML = "<span>Antonym: " + meaning.definitions.antonyms +"</span>";
            container.appendChild(Antonym);

            var example = document.createElement("p");
            example.innerHTML = "<span>Examples: " + meaning.definitions.example +"</span>";
            container.appendChild(example);

            meaningDiv.appendChild(container);

        })

        wordDiv.appendChild(meaningDiv);

        dictionaryDiv.appendChild(wordDiv);
    });
      
    $("#content").html(dictionaryDiv);
    
});
