chrome.runtime.onInstalled.addListener(() => {
    console.log("Background script installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background:", message);

    if (message.action === "scrapePage") {
        // Get the current tab information
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const tab = tabs[0]; // Get the active tab in the current window

                // Now execute the script on the current active tab
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        func: getTextContent
                    },
                    (injectionResults) => {
                        const textContent = injectionResults[0].result;  // Extracted content
                        console.log("Scraped content:", textContent);
                        sendResponse({ action: 'scrapeComplete', textContent: textContent });
                    }
                );
            }
        });

        // Keep the message channel open for asynchronous response
        return true;
    }
});

function getTextContent() {
    return document.body.innerText || document.body.textContent;  // Extract plain text
}
