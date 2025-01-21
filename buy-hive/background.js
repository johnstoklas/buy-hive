chrome.runtime.onInstalled.addListener(() => {
    console.log("Background script installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //console.log("Message received in background:", message);

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
                        const textContent = injectionResults[0].result; // Extracted content
                        console.log("Scraped content:", textContent);

                        // Make a POST request to your backend
                        fetch("http://127.0.0.1:8000/extract", {
                            method: "POST",
                            headers: {
                                "Content-Type": "text/plain",
                            },
                            body: textContent, // Send the extracted textContent
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then((data) => {
                                console.log("Response from backend:", data);
                                // Send response back to the frontend
                                sendResponse({ action: "scrapeComplete", result: data });
                            })
                            .catch((error) => {
                                console.error("Error sending request to backend:", error);
                                sendResponse({ action: "scrapeFailed", error: error.message });
                            });
                    }
                );
            }
        });

        // Keep the message channel open for asynchronous response
        return true;
    }
});

function getTextContent() {
    return document.body.innerText || document.body.textContent; // Extract plain text
}
