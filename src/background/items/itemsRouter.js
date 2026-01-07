import {
    handleGetItems,
    handleScrapeItem,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleMoveItem,
    handleDeleteItemAll,
} from "./itemsService.js";

export const itemRouter = {
    getItems: handleGetItems,
    scrapeItem: handleScrapeItem,
    addItem: handleAddItem,
    editItem: handleEditItem,
    deleteItem: handleDeleteItem,
    moveItem: handleMoveItem,
    deleteItemAll: handleDeleteItemAll,
};
