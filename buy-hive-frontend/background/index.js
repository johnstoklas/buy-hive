import { handleMessage } from "./router.js";

console.log("Background script started");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender, sendResponse);
    return true;
});
