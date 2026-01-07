import { 
    handleGetCarts, 
    handleAddNewCart, 
    handleEditCart, 
    handleShareCart, 
    handleDeleteCart 
} from "./carts/cartsService.js";
import { 
    handleGetItems, 
    handleScrapeItem, 
    handleAddItem, 
    handleEditItem, 
    handleDeleteItem, 
    handleMoveItem, 
    handleDeleteItemAll, 
} from "./items/itemsService.js";

export async function handleMessage(message, sender, sendResponse) {
    switch (message.action) {
        case "getCarts":
            handleGetCarts(message, sender, sendResponse);
            return true;
        case "addCart":
            handleAddNewCart(message, sender, sendResponse);
            return true;
        case "editCartName":
            handleEditCart(message, sender, sendResponse);
            return true;
        case "deleteCart":
            handleDeleteCart(message, sender, sendResponse);
            return true;
        case "getItems":
            handleGetItems(message, sender, sendResponse);
            return true;
        case "scrapeItem":
            handleScrapeItem(message, sender, sendResponse);
            return true;
        case "editItem":
            handleEditItem(message, sender, sendResponse);
            return true;
        case "deleteItem":
            handleDeleteItem(message, sender, sendResponse);
            return true;
        case "addItem":
            handleAddItem(message, sender, sendResponse);
            return true;
        case "moveItem":
            handleMoveItem(message, sender, sendResponse);
            return true;
         case "deleteItemAll":
            handleDeleteItemAll(message, sender, sendResponse);
            return true;
        case "shareCart":
            handleShareCart(message, sender, sendResponse);
            return true;        
        default:
            console.warn(`Unknown action: ${message.action}`);
            sendResponse({ status: "error", message: "Unknown action" });
            return false; 
    }
}