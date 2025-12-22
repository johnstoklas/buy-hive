const apiUrl = "https://api.buyhive.dev"

export async function handleAddNewCart(message, sender, sendResponse) {
    const { accessToken, cartName } = message.data;
    
    if (!accessToken || !cartName) {
      sendResponse({ status: "error", message: "Invalid folder data" });
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
      console.error("Error adding folder:", error);
      sendResponse({ status: "error", message: error.message });
    }
  }
