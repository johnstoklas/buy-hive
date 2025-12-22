import { handleMessage } from "./router.js";

console.log("Background script started");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    handleMessage(msg, sender, sendResponse);
    return true;
});
