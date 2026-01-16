import { getAccessToken } from "../auth/authService.js";

const apiUrl = "https://buyhive-backend-production.up.railway.app"

export async function handleGetItems(message, sender, sendResponse) {
    const accessToken = await getAccessToken();
    const { cartId } = message.data;

    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in" });
        return;
    }
    if (!cartId) {
        sendResponse({ status: "error", message: "Invalid payload" });
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

        const rawData = await response.json();
        const data = rawData.items.map(({ selected_cart_ids, added_at, ...item }) => item);
        sendResponse({ status: "success", data }); 
    } catch (error) {
        console.error("Error fetching data:", error);
        sendResponse({ status: "error", message: error.message });
    }
};

// Adds an item to specified carts
export async function handleAddItem(message, sender, sendResponse) {
    const accessToken = await getAccessToken();
    const { scrapedItem, selectedCartIds } = message.data;

    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in" });
        return;
    }
    if (!scrapedItem || !selectedCartIds) {
        sendResponse({ status: "error", message: "Invalid payload" });
        return;
    }

    const payload = {
        name: scrapedItem.name,
        price: scrapedItem.price,
        image: scrapedItem.image,
        url: scrapedItem.url,
        notes: scrapedItem.notes,
        selected_cart_ids: selectedCartIds,
    };

    const endpoint = `${apiUrl}/carts/items/add-new`;
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

        const data = await response.json();
        sendResponse({ status: "success", data });
    } catch (error) {
        console.error("Error adding item:", error);
        sendResponse({ status: "error", error });
    }
}

// Edits the notes of an item
export async function handleEditItem(message, sender, sendResponse) {
    const accessToken = await getAccessToken();
    const { notes, itemId } = message.data;
    
    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in" });
        return;
    }
    if (!notes || !itemId) {
        sendResponse({ status: "error", message: "Invalid payload" });
        return;
    }

    const endpoint = `${apiUrl}/carts/items/${itemId}/edit-note`;
    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: { 
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ new_note: notes }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        sendResponse({ status: "success", data });
    } catch (error) {
        console.error("Error editing notes:", error);
        sendResponse({ status: "error", message: error.message });
    }
}

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

// Moves an item between carts
export async function handleMoveItem(message, sender, sendResponse) {
    const accessToken = await getAccessToken();
    const { itemId, selectedCarts } = message.data;

    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in" });
        return;
    }
    if (!itemId || !selectedCarts) {
        sendResponse({ status: "error", message: "Invalid payload" });
        return;
    }

    const endpoint = `${apiUrl}/carts/items/${itemId}/move`;

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: { 
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ selected_cart_ids: selectedCarts })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // const data = await response.json();
        sendResponse({ status: "success" });
    } catch (error) {
        console.error("Error modifying item:", error);
        sendResponse({ status: "error", message: error.message });
    }
}

// Deletes an item from every cart it is in
export async function handleDeleteItemAll(message, sender, sendResponse) {
    const accessToken = await getAccessToken();
    const { itemId } = message.data;
    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in" });
        return;
    }
    if (!itemId) {
        sendResponse({ status: "error", message: "Invalid payload" });
        return;
    }

    const endpoint = `${apiUrl}/carts/items/${itemId}/nuke`;
    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}`, }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        sendResponse({ status: "success", data });
    } catch (error) {
        console.error("Error deleting item all:", error);
        sendResponse({ status: "error", message: error.message });
    }
}
