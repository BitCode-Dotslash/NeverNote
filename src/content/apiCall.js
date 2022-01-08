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
  
  //Meaning api call
  function callMeaningAPI(word){
      //call API
      console.log(word);
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