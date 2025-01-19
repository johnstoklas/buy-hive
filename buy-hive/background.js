chrome.runtime.onInstalled.addListener(() => {
    chrome.action.onClicked.addListener((tab) => {
        chrome.tabs.create({ url: "popup.html" });
    });
});
