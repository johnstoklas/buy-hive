const apiUrl = "https://buyhive-backend-production.up.railway.app"

export async function handleFetchItems(message, sender, sendResponse) {
    const { accessToken, cartId } = message.data;
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

// Adds an item to specified carts
export async function handleAddItem(message, sender, sendResponse) {
    const { accessToken, itemData } = message.data;

    const requestBody = {
        name: itemData.itemTitle,
        price: itemData.itemPrice,
        image: itemData.itemImage,
        url: itemData.itemUrl,
        notes: itemData.itemNotes,
        selected_cart_ids: itemData.selectedCarts,
    };

    console.log("Request Body:", JSON.stringify(requestBody));

    if (!accessToken) {
        sendResponse({ status: "error", message: "Invalid item data" });
        return;
    }

    const endpoint = `${apiUrl}/carts/items/add-new`;
    try {
        const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(requestBody),
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
    const { accessToken, notes, cartId, itemId } = message.data;
    console.log(notes);
    if (!accessToken) {
        sendResponse({ status: "error", message: "Invalid item data" });
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
    const { accessToken, cartId, itemId } = message.data;
    if (!accessToken) {
        sendResponse({ status: "error", message: "Invalid item data" });
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
    const { accessToken, itemId, selectedCarts } = message.data;

    if (!accessToken || !itemId) {
        sendResponse({ status: "error", message: "Invalid request: missing email or item ID" });
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
            body: JSON.stringify({ selected_cart_ids: selectedCarts,})
        });

        let data;
        try {
            data = await response.json(); // Try to parse JSON
        } catch (jsonError) {
            throw new Error(`Invalid JSON response: ${jsonError.message}`);
        }

        if (!response.ok) {
            throw new Error(data.detail || data.message || `HTTP error! Status: ${response.status}`);
        }

        sendResponse({ status: "success", data });
    } catch (error) {
        console.error("Error modifying item:", error);
        sendResponse({ status: "error", message: error.message || "An unknown error occurred" });
    }
}

// Deletes all item from a cart
export async function handleDeleteItemAll(message, sender, sendResponse) {
    const { accessToken, itemId } = message.data;
    if (!accessToken) {
        sendResponse({ status: "error", message: "Invalid item data" });
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

