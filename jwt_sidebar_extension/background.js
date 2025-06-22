// background.js

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "LOGIN_SUCCESS") {
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (tab.url?.startsWith("http")) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
          });
        }
      }
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.startsWith("http")) {
    chrome.storage.local.get("jwt", ({ jwt }) => {
      if (jwt) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["content.js"]
        });
      }
    });
  }
});


