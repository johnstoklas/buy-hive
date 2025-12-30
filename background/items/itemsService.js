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
