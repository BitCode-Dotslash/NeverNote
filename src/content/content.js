console.log("Content Script at Work");

//function to create extension container to display
async function createExtensionContainer(){
    
    //create container
    console.log("add container");
    var extensionContainer = document.createElement("div");
    extensionContainer.id = "extensionContainer";
    extensionContainer.style.cssText ="position:absolute;top:0;right:0;width:auto;height:auto;opacity:1;z-index:1000000;background-color:pink;";
    document.body.appendChild(extensionContainer);

    
    return new Promise(async (resolve, reject) => {
        try{
            //get HTML data
            console.log("add container data");
            var htmlURL = chrome.runtime.getURL("/src/content/content.html");
            var htmlContent = await $.get(htmlURL);
            $("#extensionContainer").html(htmlContent);
            resolve();
        } catch (err) {
            reject(err);
        }
        
    })
}



// display container on right side on ctrl + Selection event 
$(document).mouseup(async function (event) {
    if ((event.ctrlKey || event.metaKey) && window.getSelection) {
        
        console.log("Detected selection with ctrl key");

        //get selected text
        var selectedText = window.getSelection().toString(); 
        selectedText = selectedText.trim();
        console.log(selectedText);

        //create display container
        createExtensionContainer()
          .then(() => {
              //add selected text to the container
              console.log("containerAdded");
              $("#extension #selectedText").html(selectedText);
              console.log($("#extension"));
          }).catch((err) => {
              console.log(err);
          })
    
    }
  });
  

  
  