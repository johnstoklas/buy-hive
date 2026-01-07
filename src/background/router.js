import { cartRouter } from "./carts/cartsRouter.js";
import { itemRouter } from "./items/itemsRouter.js";

const routers = {
    ...cartRouter,
    ...itemRouter,
};

export function handleMessage(message, sender, sendResponse) {
    const handler = routers[message.action];

    if (!handler) {
        console.warn(`Unknown action: ${message.action}`);
        sendResponse({ status: "error", message: "Unknown action" });
        return false;
    }

    handler(message, sender, sendResponse);
    return true;
}
