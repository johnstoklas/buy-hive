import { handleFetchItems, handleAddItem, handleEditItem, handleDeleteItem} from "./items/itemsService.js";
import { handleFetchCarts, handleAddNewCart, handleEditCart, handleDeleteCart } from "./carts/cartsService.js";

export async function handleMessage(message, sender, sendResponse) {
    switch (message.action) {
        // case "scrapePage":
        //     handleScrapePage(message, sender, sendResponse);
        //     return true;
        // case "sendImageData":
        //     handleScrapeImage(message, sender, sendResponse);
        //     return true;
        case "fetchCarts":
            handleFetchCarts(message, sender, sendResponse);
            return true;
        // case "fetchFolderItems":
        //     handleFetchItems(message, sender, sendResponse);
        //     return true;
        case "addNewCart":
            handleAddNewCart(message, sender, sendResponse);
            return true;
        case "editFolder":
            handleEditCart(message, sender, sendResponse);
            return true;
        case "deleteFolder":
            handleDeleteCart(message, sender, sendResponse);
            return true;
        case "fetchItems":
            handleFetchItems(message, sender, sendResponse);
            return true;
        case "editItem":
            handleEditItem(message, sender, sendResponse);
            return true;
        // case "deleteItemAll":
        //     handleDeleteItemAll(message, sender, sendResponse);
        //     return true;
        case "addItem":
            handleAddItem(message, sender, sendResponse);
            return true;
        case "deleteItem":
            handleDeleteItem(message, sender, sendResponse);
            return true;
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