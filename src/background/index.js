import { handleMessage } from "./router.js";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "storeUserData") {
        chrome.storage.local.set({ access_token: message.access_token });
        const user = {
            name: message.user.name,
            email: message.user.email,
            picture: message.user.picture,
        }
        chrome.storage.local.set({user});
    }
    else {
        handleMessage(message, sender, sendResponse);
    }
    return true;
});
