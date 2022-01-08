chrome.runtime.onInstalled.addListener(function () {
  // chrome.storage.sync.set({ notes: {}, automate: false });
  var optionsUrl = chrome.runtime.getURL("src/option/options.html");
  chrome.storage.sync.set({ notes: {}, optionsUrl: optionsUrl });
});
