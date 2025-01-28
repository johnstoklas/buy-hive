chrome.runtime.onInstalled.addListener(() => {
    console.log("Background script installed");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case "scrapePage":
        handleScrapePage(message, sender, sendResponse);
        return true;

      case "fetchData":
        handleFetchData(message, sender, sendResponse);
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
  
      default:
        console.warn(`Unknown action: ${message.action}`);
        sendResponse({ status: "error", message: "Unknown action" });
        return false; 
    }
  });

  async function handleScrapePage(message, sender, sendResponse) { 
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { 
      if (tabs.length > 0) { 
        const tab = tabs[0]; 
    
        chrome.scripting.executeScript(
          { 
            target: { tabId: tab.id }, 
            func: getTextContent 
          }, 
          async (injectionResults) => { 
            if (chrome.runtime.lastError) { 
              console.error("Error executing script:", chrome.runtime.lastError.message); 
              sendResponse({ status: 'error', message: chrome.runtime.lastError.message }); 
              return; 
            } 
    
            const endpoint = "http://127.0.0.1:8000/extract";
            const textContent = injectionResults[0]?.result || "";
    
            try {
              const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: textContent,
              });
    
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
    
              const data = await response.json();
              sendResponse({ status: "success", data });
            } catch (error) {
              console.error("Error processing the request:", error);
              sendResponse({ status: "error", message: error.message });
            }
          }
        );
      } else {
        sendResponse({ status: "error", message: "No active tabs found." });
      }
    });    
  }

  function getTextContent() { 
    return document.body.innerText || document.body.textContent; 
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
      sendResponse({ status: "success", data });
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