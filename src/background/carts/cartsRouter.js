import {
    handleGetCarts,
    handleAddNewCart,
    handleEditCart,
    handleShareCart,
    handleDeleteCart
} from "./cartsService.js";

export const cartRouter = {
    getCarts: handleGetCarts,
    addCart: handleAddNewCart,
    editCartName: handleEditCart,
    deleteCart: handleDeleteCart,
    shareCart: handleShareCart,
};
