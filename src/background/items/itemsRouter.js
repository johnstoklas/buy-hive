import {
    handleGetItems,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleMoveItem,
    handleDeleteItemAll,
} from "./itemsService.js";

export const itemRouter = {
    getItems: handleGetItems,
    addItem: handleAddItem,
    editItem: handleEditItem,
    deleteItem: handleDeleteItem,
    moveItem: handleMoveItem,
    deleteItemAll: handleDeleteItemAll,
};
