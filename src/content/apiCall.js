//translate api call
function callTranslateAPI(translateFrom, translateTo, text) {
    console.log(translateFrom, translateTo);
    var myHeaders = new Headers();
    myHeaders.append("Ocp-Apim-Subscription-Key", translatorAPI.key);
    myHeaders.append("Ocp-Apim-Subscription-Region", translatorAPI.region);
    myHeaders.append("Content-type", "application/json");
    myHeaders.append("X-ClientTraceId", "4cde457d-aa2c-437a-ba3d-3aa11dc6642e");

    var raw = JSON.stringify([
        {
        "text": text
        }
    ]);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return new Promise((resolve, reject) => {
        fetch("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from="+translateFrom+"&to="+translateTo, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(JSON.parse(result)[0].translations[0].text);
            resolve(JSON.parse(result)[0].translations[0].text);
        })
        .catch(error => {console.log('error', error);
            reject(error);
        });
    })

    // return "Text is Translated";
  }


  //text to speech api call
  function textToSpeechAPI(text){
    
    var synthesizer;
  
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      speechAPI.key,
      speechAPI.region
    );
    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
  
    synthesizer.speakTextAsync(
      text,
      function (result) {
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished for [" + text + "].\n");
        } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
          console.log(
            "synthesis failed. Error detail: " + result.errorDetails + "\n"
          );
        }
        console.log(result);
        synthesizer.close();
        synthesizer = undefined;
      },
      function (err) {
        console.log(err);
  
        synthesizer.close();
        synthesizer = undefined;
      }
    );
  }
  
  //Meaning api call
  function callMeaningAPI(word){
      //call API
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      console.log(word);
      fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+word, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
      
      return "This is the meaning API";
    }
    
  //Synonym api call
    function callSynonymAPI(word){
      //call API
      console.log(word);
      return "This is the Synonym API";
    }
    
  //antonym api call
  function callAntonymAPI(word){
      //call API
      console.log(word);
      return "This is the Antonym API";
  }
    
  
  // Example api call
  function callExampleAPI(word){
      //call API
      console.log(word);
      return "This is the Example API";
  }