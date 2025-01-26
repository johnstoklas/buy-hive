chrome.runtime.onInstalled.addListener(() => {
    console.log("Background script installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "scrapePage":
            handleScrapePage(message, sender, sendResponse);
            return true;

        case "sendUserInfo":
            handleSendUserInfo(message, sender, sendResponse);
            return true;

        case "addNewFolder":
            handleAddNewFolder(message, sender, sendResponse);
            return true;

        case "fetchData":
            handleFetchData(message, sender, sendResponse);
            return true;

        default:
            console.warn(`Unknown action: ${message.action}`);
            sendResponse({ status: 'error', message: 'Unknown action' });
            return false; // Explicitly return false for unknown actions
    }
});

function handleScrapePage(message, sender, sendResponse) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tab = tabs[0];

            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    func: getTextContent,
                },
                (injectionResults) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error executing script:", chrome.runtime.lastError.message);
                        sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
                        return;
                    }

                    const textContent = injectionResults[0]?.result || "";
                    console.log("Scraped content:", textContent);

                    fetch("http://127.0.0.1:8000/extract", {
                        method: "POST",
                        headers: {
                            "Content-Type": "text/plain",
                        },
                        body: textContent,
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then((data) => {
                            console.log("Response from backend:", data);
                            sendResponse({ status: 'success', data });
                        })
                        .catch((error) => {
                            console.error("Error sending request to backend:", error);
                            sendResponse({ status: 'error', error: error.message });
                        });
                }
            );
        } else {
            sendResponse({ status: 'error', message: 'No active tab found' });
        }
    });
}

function handleSendUserInfo(message, sender, sendResponse) {
    const userInfo = message.data;
    if (!userInfo || !userInfo.email || !userInfo.name) {
        sendResponse({ status: 'error', message: 'Invalid user info' });
        return;
    }

    console.log('Received user data:', userInfo);

    fetch("http://127.0.0.1:8000/users/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("User added:", data);
            sendResponse({ status: 'success', message: 'User data received', data });
        })
        .catch((error) => {
            console.error("Error adding user:", error);
            sendResponse({ status: 'error', error: error.message });
        });
}

async function handleAddNewFolder(message, sender, sendResponse) {
    sendResponse({ status: "success", data: "Example response" });
    const { email, cartName } = message.data;
    if (!email || !cartName) {
        sendResponse({ status: 'error', message: 'Invalid folder data' });
        return;
    }

    console.log('Adding new folder:', cartName);

    const endpoint = `http://127.0.0.1:8000/carts/${email}`;

    await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cart_name: cartName,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Folder added successfully:", data);
            sendResponse({ status: 'success', data });
        })
        .catch((error) => {
            console.error("Error adding folder:", error);
            sendResponse({ status: 'error', error: error.message });
        });
        return true;
}

async function handleFetchData(message, sender, sendResponse) {
    const { email } = message.data;
    if (!email) {
        sendResponse({ status: "error", message: "Email is required to fetch data" });
        return;
    }

    console.log("Fetching data for email:", email);

    const endpoint = `http://127.0.0.1:8000/carts/${email}`;
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        sendResponse({ status: "success", data }); // Send the fetched data back to the React component
    } catch (error) {
        console.error("Error fetching data:", error);
        sendResponse({ status: "error", message: error.message });
    }

    return true; // Keep the message channel open for async responses
}


function getTextContent() {
    return document.body.innerText || document.body.textContent; // Extract plain text
}
