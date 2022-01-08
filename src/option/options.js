// var automateField = document.getElementById("automate").querySelector("input");

// chrome.storage.sync.get(["automate"], function (result) {
//   var automateFieldValue = result.automate;
//   automateField.checked = automateFieldValue;
// });

// automateField.addEventListener("change", async function () {
//   await chrome.storage.sync.set({ automate: this.checked });
// });

chrome.storage.sync.get(["vocab"], function (result) {
  console.log(result);

  $("#content").html("Here goes your content");
});
