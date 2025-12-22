import { handleFetchData } from "./items/itemsService.js";
import { handleAddNewCart } from "./carts/cartsService.js";

export async function handleMessage(message, sender, sendResponse) {
    switch (message.action) {
        // case "scrapePage":
        //     handleScrapePage(message, sender, sendResponse);
        //     return true;
        // case "sendImageData":
        //     handleScrapeImage(message, sender, sendResponse);
        //     return true;
        case "fetchData":
            handleFetchData(message, sender, sendResponse);
            return true;
        // case "fetchFolderItems":
        //     handleFetchItems(message, sender, sendResponse);
        //     return true;
        case "addNewFolder":
            handleAddNewCart(message, sender, sendResponse);
            return true;
        // case "editFolder":
        //     handleEditFolder(message, sender, sendResponse);
        //     return true;
        // case "deleteFolder":
        //     handleDeleteFolder(message, sender, sendResponse);
        //     return true;
        // case "editNotes":
        //     handleEditNotes(message, sender, sendResponse);
        //     return true;
        // case "deleteItem":
        //     handleDeleteItem(message, sender, sendResponse);
        //     return true;
        // case "deleteItemAll":
        //     handleDeleteItemAll(message, sender, sendResponse);
        //     return true;
        // case "addItem":
        //     handleAddItem(message, sender, sendResponse);
        //     return true;
        // case "moveItem":
        //     handleMoveItem(message, sender, sendResponse);
        //     return true;
        // case "updateItems":
        //     updateItems(message, sender, sendResponse);
        //     return true;
        // case "sendEmail":
        //     handleShareEmail(message, sender, sendResponse);
        //     return true;        
        default:
            console.warn(`Unknown action: ${message.action}`);
            sendResponse({ status: "error", message: "Unknown action" });
            return false; 
    }
}