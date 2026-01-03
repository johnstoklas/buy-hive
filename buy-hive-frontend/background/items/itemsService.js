import { getAccessToken } from "../auth/authService.js";

const apiUrl = "https://buyhive-backend-production.up.railway.app"

export async function handleGetItems(message, sender, sendResponse) {
    const accessToken = await getAccessToken();
    const { cartId } = message.data;

    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in"});
        return;
    }

    const endpoint = `${apiUrl}/carts/${cartId}/items`;
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: { 
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        sendResponse({ status: "success", data }); 
    } catch (error) {
        console.error("Error fetching data:", error);
        sendResponse({ status: "error", message: error.message });
    }
};

// Deletes an item from a cart
export async function handleDeleteItem(message, sender, sendResponse) {
    const accessToken = await getAccessToken();
    const { cartId, itemId } = message.data;

    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in" });
        return;
    }
    if (!cartId || !itemId) {
        sendResponse({ status: "error", message: "Invalid payload" });
        return;
    }

    const endpoint = `${apiUrl}/carts/${cartId}/items/${itemId}`;
    try {
        const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}`, },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        sendResponse({ status: "success", data });
    } catch (error) {
        console.error("Error deleting item:", error);
        sendResponse({ status: "error", message: error.message });
    }
}