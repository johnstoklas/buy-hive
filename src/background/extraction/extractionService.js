import { getValidAccessToken } from "../auth/authService";

const apiUrl = "https://buyhive-backend-production.up.railway.app"

export async function handleScrapeItem(message, sender, sendResponse) {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in" });
        return;
    }

    try {
        chrome.tabs.query({ active: true, currentWindow: true }, async(tabs) => {
            const tabId = tabs[0]?.id;
            if (!tabId) {
                sendResponse({ status: "error", message: "No active tab" });
                return;
            }

            await chrome.scripting.executeScript({
                target: { tabId },
                files: ["content.js"],
            });

            chrome.tabs.sendMessage(tabId, { action: "extractProduct" }, async(response) => {
                if (chrome.runtime.lastError) {
                    sendResponse({status: "error", message: "Chrome runtime last"});
                    return;
                }

                const { extractorType } = response.data;
                
                if (response.success) {
                    // if we used a specific scraper, we are confident and we send the data back
                    if(extractorType !== "generic") {
                        const { url, image, name, price } = response.data;
                        const item_data = { url, image, name, price };

                        sendResponse({status: "success", data: item_data});
                        return;
                    }

                    // if it used the general scraper we check its confidence
                    const { imageConfidence, nameConfidence, priceConfidence, url } = response.data;
                    const payload = {
                        url: url,
                        image_confidence: imageConfidence / 100,
                        name_confidence: nameConfidence / 100,
                        price_confidence: priceConfidence / 100,
                    }

                    if (imageConfidence >= 70 && nameConfidence >= 70 && priceConfidence >= 70) {
                        // inform the backend that this was done by the generic scraper
                        payload.type = "GEN_SCRAPER_CONFIDENT";
                        await handleAddFailedExtraction(payload, accessToken, "item");

                        // we send the product details back to the frontend
                        const { url, image, name, price } = response.data;
                        const item_data = { url, image, name, price };

                        sendResponse({status: "success", data: item_data});
                        return;
                    }
                    else {
                        // if it wasn't confident, we send the url to our backend with the proper message
                        payload.type = "GEN_SCRAPER_NOT_CONFIDENT";
                        await handleAddFailedExtraction(payload, accessToken, "item");

                        // we have OpenAI scrape the innerHTML as a backup method
                        const { cart_items } = await handleOpenAIScrape(accessToken, tabId);
                        const { price, product_name } = cart_items;
                        const item_data = {
                            image: null,
                            price: price,
                            url: url,
                            name: product_name,
                        };
                        sendResponse({status: "success", data: item_data});
                    }   
                }
                else {
                    // if page user selected is not a product page we notify the user and send the url to our backend
                    const { errorType, error, errorData } = response;
                    const { confidence, domain } = errorData;
                    const payload = {
                        failure_type: errorType,
                        confidence: confidence,
                        url: domain,
                    }
                    await handleAddFailedExtraction(payload, accessToken, "page");
                    sendResponse({ status: "error", error });
                    return;
                }
                
            });
        });
    } catch {
        console.error("Error adding item:", error);
        sendResponse({ status: "error", error });
    }
}

async function handleAddFailedExtraction(payload, accessToken, type) {
    const endpoint = `${apiUrl}/failed-extraction/${type}`;
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
}

function handleOpenAIScrape(accessToken, tabId) {
    return new Promise((resolve, reject) => {
        // scrape the innerHTML to send to the openAI endpoint
        chrome.tabs.sendMessage(tabId, { action: "getInnerText" }, async (res) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
                return;
            }

            try {
                const { innerText } = res.data;

                if (!innerText || innerText.trim().length === 0) {
                    throw new Error("No innerText returned from content script");
                }

                const endpoint = `${apiUrl}/extract/extract`;

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { 
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ inner_text: innerText }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    });
}
