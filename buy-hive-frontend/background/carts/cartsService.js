import { getAccessToken } from "../auth/authService.js"

const apiUrl = "https://buyhive-backend-production.up.railway.app"

export async function handleGetCarts(message, sender, sendResponse) {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in"});
        return;
    }

    const endpoint = `${apiUrl}/carts`;
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

export async function handleAddNewCart(message, sender, sendResponse) {
  const accessToken = await getAccessToken();
  const { cartName } = message.data;

  if (!accessToken) {
    sendResponse({ status: "error", message: "User must be signed in" });
    return;
  }
  if (!cartName) {
    sendResponse({ status: "error", message: "Invalid payload" });
    return;
  }

  const endpoint = `${apiUrl}/carts`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ cart_name: cartName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const newData = {
      cart_id: data.cart_id,
      cart_name: cartName,
    }
    sendResponse({ status: "success", data: newData });
  } catch (error) {
    console.error("Error adding cart:", error);
    sendResponse({ status: "error", message: error.message });
  }
}

export async function handleEditCart(message, sender, sendResponse) {
  const { accessToken, cartId, newCartName } = message.data;
  
  if (!accessToken || !newCartName) {
    sendResponse({ status: "error", message: "Invalid folder data" });
    return;
  }

  const endpoint = `${apiUrl}/carts/${cartId}/edit-name`;
  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ new_name: newCartName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    sendResponse({ status: "success", data });
  } catch (error) {
    console.error("Error updating folder:", error);
    sendResponse({ status: "error", message: error.message });
  }
}

export async function handleDeleteCart(message, sender, sendResponse) {
  const { accessToken, cartId } = message.data;

  if (!accessToken) {
    sendResponse({ status: "error", message: "Invalid folder data" });
    return;
  }

  const endpoint = `${apiUrl}/carts/${cartId}`;
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
    console.error("Error deleting folder:", error);
    sendResponse({ status: "error", message: error.message });
  }
}
