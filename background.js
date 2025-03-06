  chrome.runtime.onInstalled.addListener(() => {
    console.log("Background script installed");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case "scrapePage":
        handleScrapePage(message, sender, sendResponse);
        return true;

      case "sendImageData":
        handleScrapeImage(message, sender, sendResponse);
        return true;

      case "fetchData":
        handleFetchData(message, sender, sendResponse);
        return true;

      case "fetchFolderItems":
        handleFetchItems(message, sender, sendResponse);
        return true;
  
      case "addNewFolder":
        handleAddNewFolder(message, sender, sendResponse);
        return true;

      case "editFolder":
        handleEditFolder(message, sender, sendResponse);
        return true;

      case "deleteFolder":
        handleDeleteFolder(message, sender, sendResponse);
        return true;

      case "editNotes":
        handleEditNotes(message, sender, sendResponse);
        return true;
      
      case "deleteItem":
        handleDeleteItem(message, sender, sendResponse);
        return true;

      case "deleteItemAll":
        handleDeleteItemAll(message, sender, sendResponse);
        return true;

      case "addItem":
        handleAddItem(message, sender, sendResponse);
        return true;

      case "moveItem":
        handleMoveItem(message, sender, sendResponse);
        return true;

      case "updateItems":
        updateItems(message, sender, sendResponse);
        return true;

      case "sendEmail":
        checkDomainExists(message, sender, sendResponse);
        return true;        
  
      default:
        console.warn(`Unknown action: ${message.action}`);
        sendResponse({ status: "error", message: "Unknown action" });
        return false; 
    }
  });

  // Gets title and pricing from current webpage
  async function handleScrapePage(message, sender, sendResponse) { 
    const { innerText } = message.data;
    
    const endpoint = `http://127.0.0.1:8000/extract`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: innerText,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      sendResponse({ status: "success", data });
    } catch (error) {
      console.error("Error scraping page: ", error);
      sendResponse({ status: "error", message: error.message });
    }
  }

  // Gets image from current webpage
  async function handleScrapeImage(message, sender, sendResponse) { 
    console.log("dud we get  here?")
    const { imageData, url } = message.data;
    
    const endpoint = `http://127.0.0.1:8000/analyze-images`;
    try {
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_url: url,
          image_urls: imageData,
        })
      });/*
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "plain/text" },
        body: imageData
      })*/
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      sendResponse({ status: "success", data });
    } catch (error) {
      console.error("Error getting image data: ", error);
      console.error("you a bitch groq: ", message);
      sendResponse({ status: "error", message: error.message });
    }
  }
  
  // Fetches user data when extension is opened
  async function handleFetchData(message, sender, sendResponse) {
    const { email } = message.data;
    if (!email) {
      sendResponse({ status: "error", message: "Email is required to fetch data" });
      return;
    }
  
    const endpoint = `http://127.0.0.1:8000/carts/${email}`;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      sendResponse({ status: "success", data }); // Send fetched data back to React
    } catch (error) {
      console.error("Error fetching data:", error);
      sendResponse({ status: "error", message: error.message });
    }
  }

  // Fetches all the items from a specificed cart
  async function handleFetchItems(message, sender, sendResponse) {
    const { email, cartId } = message.data;
    if (!email) {
      sendResponse({ status: "error", message: "Email is required to fetch data" });
      return;
    }
  
    const endpoint = `http://127.0.0.1:8000/carts/${email}/${cartId}/items`;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      sendResponse({ status: "success", data }); // Send fetched data back to React
    } catch (error) {
      console.error("Error fetching items from cart:", error);
      sendResponse({ status: "error", message: error.message });
    }
  }
  
  // Adds a new folder to the database
  async function handleAddNewFolder(message, sender, sendResponse) {
    const { email, cartName } = message.data;
    if (!email || !cartName) {
      sendResponse({ status: "error", message: "Invalid folder data" });
      return;
    }
  
    const endpoint = `http://127.0.0.1:8000/carts/${email}`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Edits an existing folder in the database 
  async function handleEditFolder(message, sender, sendResponse) {
    const { email, cartId, newCartName } = message.data;
    if (!email || !newCartName) {
      sendResponse({ status: "error", message: "Invalid folder data" });
      return;
    }
  
    const endpoint = `http://127.0.0.1:8000/carts/${email}/${cartId}/edit-name`;
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
  
  // Deletes an existing folder in the database 
  async function handleDeleteFolder(message, sender, sendResponse) {
    const { email, cartId } = message.data;
    console.log("dud we get here")
    if (!email) {
      sendResponse({ status: "error", message: "Invalid folder data" });
      return;
    }
  
    const endpoint = `http://127.0.0.1:8000/carts/${email}/${cartId}`;
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
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

  // Edits the notes of an item
  async function handleEditNotes(message, sender, sendResponse) {
    const { email, notes, cartId, itemId } = message.data;
    console.log(notes);
    if (!email) {
      sendResponse({ status: "error", message: "Invalid item data" });
      return;
    }
  
    const endpoint = `http://127.0.0.1:8000/carts/${email}/items/${itemId}/edit-note`;
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  // Deletes an item from a folder
  async function handleDeleteItem(message, sender, sendResponse) {
    const { email, cartId, itemId } = message.data;
    if (!email) {
      sendResponse({ status: "error", message: "Invalid item data" });
      return;
    }
  
    const endpoint = `http://127.0.0.1:8000/carts/${email}/${cartId}/items/${itemId}`;
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        body: JSON.stringify({ item_id: itemId }),
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

  // Deletes an item from a folder
  async function handleDeleteItemAll(message, sender, sendResponse) {
    const { email, itemId } = message.data;
    if (!email) {
      sendResponse({ status: "error", message: "Invalid item data" });
      return;
    }
  
    const endpoint = `http://127.0.0.1:8000/carts/${email}/items/${itemId}/nuke`;
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
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

  // Adds an item to specified folders
  async function handleAddItem(message, sender, sendResponse) {
    const { email, itemData } = message.data;

    const requestBody = {
      name: itemData.itemTitle,
      price: itemData.itemPrice,
      image: itemData.itemImage,
      url: itemData.itemUrl,
      notes: itemData.itemNotes,
      selected_cart_ids: itemData.selectedCarts,
    };
  
    console.log("Request Body:", JSON.stringify(requestBody));

    if (!email) {
      sendResponse({ status: "error", message: "Invalid item data" });
      return;
    }
  
    const endpoint = `http://127.0.0.1:8000/carts/${email}/items/add-new`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

 // Moves an item between folders
  async function handleMoveItem(message, sender, sendResponse) {
    const { email, itemId, selectedCarts, unselectedCarts } = message.data;


    if (!email || !itemId) {
        sendResponse({ status: "error", message: "Invalid request: missing email or item ID" });
        return;
    }

    const body = JSON.stringify({
        selected_cart_ids: selectedCarts,
        //remove_from_cart_ids: unselectedCarts
    });

    const endpoint = `http://127.0.0.1:8000/carts/${email}/items/${itemId}/move`;

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: body,
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

  // Updates notes of an item on the client side
  async function updateItems(message, sender, sendResponse) {
    console.log("message", message);
    chrome.runtime.sendMessage({action: "cartUpdate", data: message.data });
  }

  async function checkDomainExists(message, sender, sendResponse) {
    const { email, cartId, recipient } = message.data;

    const data = { 
      cart_id: cartId,
      recipient_email: recipient,
    };

    console.log(JSON.stringify(data));

    const endpoint = `http://127.0.0.1:8000/carts/${email}/share`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),  // Make sure this is JSON stringified
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.detail || responseData.message || `HTTP error! Status: ${response.status}`);
        }

        sendResponse({ status: "success" });
    } catch (error) {
        sendResponse({ status: "error", message: error.message || "An unknown error occurred" });
    }
}

