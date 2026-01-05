import type { Dispatch, SetStateAction } from "react";

import { useCarts } from "@/popup/context/CartContext/useCart";
import { useItems } from "@/popup/context/ItemContext/useItem";
import { useLocked } from "@/popup/context/LockedContext/useLocked";
import { useAuth0 } from "@auth0/auth0-react";

import type { ItemType, ScrapedItemType } from "@/types/ItemTypes";

import { sendChromeMessage } from "@/services/chromeService";
import { standardizePrice } from "@/utils/standardizePrice";

interface useItemActionsProps {
    isExpanded?: boolean;
    setIsExpanded?: Dispatch<SetStateAction<boolean>>; 
    setIsCartLoading?: Dispatch<SetStateAction<boolean>>; 
    setScrapedItem?: Dispatch<SetStateAction<ScrapedItemType>>; 
}

export function useItemActions({ isExpanded, setIsExpanded, setIsCartLoading, setScrapedItem } : useItemActionsProps = {}) {
    const { isLoading, isAuthenticated } = useAuth0();
    const { isLocked } = useLocked();
    const { upsertItemUI, editNoteUI } = useItems();
    const { moveItemBetweenCartsUI, removeItemFromCartUI, removeItemFromAllCartsUI } = useCarts();
    
    const getItems = async(cartId : string, itemCount: string) => {
        if (isLocked || isLoading || !isAuthenticated) return;
        if (isExpanded) { setIsExpanded?.(false); return; }
        if (parseInt(itemCount) === 0) return;

        setIsCartLoading?.(true);
        setIsExpanded?.(true);

        try {
            const data = { cartId }
            const res = await sendChromeMessage<{items: ItemType[]}>({action: "getItems", data});
            const items = res.items;
            items.forEach(item => upsertItemUI(item));
        } catch (err) {
            console.error(err);
        }

        setIsCartLoading?.(false);
    };

    const scrapeItem = async() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0]?.id;
            if (!tabId) return;

            chrome.tabs.sendMessage(tabId, { action: "extractProduct" }, (response) => {
                if (response?.success) {
                    const res = response.data;
                        setScrapedItem?.(prev => ({
                            ...prev,
                            title: res.title,
                            price: standardizePrice(res.price),
                            url: res.url,
                            image: res.image,
                        }));
                } else {
                    console.error(response?.error);
                }
            });
        });
    }

    const addItem = async(scrapedItem: ScrapedItemType) => {
        if(!scrapedItem.name || !scrapedItem.price || !scrapedItem.image || !scrapedItem.url) return;

        try {
            const data = { scrapeItem };
            await sendChromeMessage({action: "addItem", data});
        } catch(err) {
            console.error(err);
        }
    }

    const editItem = async(itemNote: string, itemId: string) => {
        if (isLoading || !isAuthenticated) return;

        try {
            const notes = itemNote.trim();
            const data = {notes, itemId};
            await sendChromeMessage({action: "editItem", data})
            editNoteUI(itemId, notes);
        } catch(err) {
            console.error(err);
        }
    }

    const moveItem = async(itemId: string, selectedCarts: string[]) => {
        if(isLoading || !isAuthenticated) return;
        
        try {
            const data = {itemId, selectedCarts};
            await sendChromeMessage({action: "moveItem", data});
            moveItemBetweenCartsUI(itemId, selectedCarts)
        } catch (err) {
            console.error(err);
        }
    }

    const deleteItem = async(cartId: string, itemId: string) => {
        if(isLoading || !isAuthenticated) return;

        try {
            const data = {cartId , itemId};
            await sendChromeMessage({action: "deleteItem", data});
            removeItemFromCartUI(cartId, itemId)
        } catch (err) {
            console.error(err);
        }
    }

    const deleteItemAll = async(itemId: string) => {
        if(isLoading || !isAuthenticated) return;

        try {
            const data = { itemId }
            await sendChromeMessage({action: "deleteItemAll", data})
            removeItemFromAllCartsUI(itemId)
        } catch (err) {
            console.error(err);
        }
    }

    return { getItems, addItem, scrapeItem, editItem, moveItem, deleteItem, deleteItemAll};
}

export default useItemActions;