import { getAccessToken } from "../auth/authService.js";

const apiUrl = "https://buyhive-backend-production.up.railway.app"

export async function handleScrapeItem(message, sender, sendResponse) {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in" });
        return;
    }

    try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0]?.id;
            if (!tabId) {
                sendResponse({ status: "error", message: "No active tab" });
                return;
            }

            chrome.tabs.sendMessage(tabId, { action: "extractProduct" }, (response) => {
                if (chrome.runtime.lastError) {
                    sendResponse({status: "error", message: "Chrome runtime last"});
                    return;
                }

                const { success } = response;
                
                if (success) {
                    // if we used a specific scraper, we are confident and we send the data back
                    
                    // if it used the general scraper, we send the the url to our backend and check the confidence
                    await handleAddFailedExtraction(payload);
                    // if it wasn't confident we send it to OpenAI and send the url to our backend
                    const { imageConfidence, nameConfidence, priceConfidence } = response.data;
                    if (imageConfidence > 80 && nameConfidence > 80 && priceConfidence > 80) sendResponse({status: "success", data: response.data});

                    await handleAddFailedExtraction(payload);
                }
                else {
                    // if page user selected is not a product page we notify the user and send the url to our backend
                    const { errorType, error, errorData } = response;
                    const { confidence, domain } = errorData;
                    const payload = {
                        type: errorType,
                        confidence_level: confidence,
                        url: domain,
                    }
                    await handleAddFailedExtraction(payload);
                    sendResponse({ status: "error", error });
                }
                
            });
        });
    } catch {
        console.error("Error adding item:", error);
        sendResponse({ status: "error", error });
    }
}

async function handleAddFailedExtraction(payload) {
    const endpoint = `${apiUrl}/failed-extraction/submit`;
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { 
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding failed extraction url to db:", error);
        throw new Error(error);
    }
    return true;
}