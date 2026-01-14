import type { Dispatch, SetStateAction } from "react";

import { useCarts } from "@/popup/context/CartContext/useCart";
import { useItems } from "@/popup/context/ItemContext/useItem";
import { useLocked } from "@/popup/context/LockedContext/useLocked";
import { useAuth0 } from "@auth0/auth0-react";

import type { ItemType, ScrapedItemType } from "@/types/ItemTypes";

import { sendChromeMessage } from "@/services/chromeService";
import { standardizePrice } from "@/utils/standardizePrice";
import { useAlert } from "@/popup/context/AlertContext/useAlert";

interface useItemActionsProps {
    isExpanded?: boolean;
    setIsExpanded?: Dispatch<SetStateAction<boolean>>; 
    setIsCartLoading?: Dispatch<SetStateAction<boolean>>; 
    setScrapedItem?: Dispatch<SetStateAction<ScrapedItemType>>; 
    setAddItemVisible?: Dispatch<SetStateAction<boolean>>; 
}

export function useItemActions({ isExpanded, setIsExpanded, setIsCartLoading, setScrapedItem, setAddItemVisible} : useItemActionsProps = {}) {
    const { isLoading, isAuthenticated } = useAuth0();
    const { isLocked } = useLocked();
    const { upsertItemUI, editNoteUI } = useItems();
    const { moveItemBetweenCartsUI, removeItemFromCartUI, removeItemFromAllCartsUI, addItemToCartUI } = useCarts();
    const { notify } = useAlert();
    
    const getItems = async(cartId : string, itemCount: string) => {
        if (isLocked || isLoading || !isAuthenticated) return;
        if (isExpanded) { setIsExpanded?.(false); return; }
        if (parseInt(itemCount) === 0) return;

        setIsCartLoading?.(true);
        setIsExpanded?.(true);

        try {
            const data = { cartId }
            const items = await sendChromeMessage<ItemType[]>({action: "getItems", data});
            items.forEach(item => upsertItemUI(item));
        } catch (err) {
            notify("error", "Error getting items for cart");
        }

        setIsCartLoading?.(false);
    };

    const scrapeItem = async () => {
        if (isLoading || !isAuthenticated) return;
      
        try {
          const item = await sendChromeMessage<ScrapedItemType>({ action: "scrapeItem" });
          if (!item) return;
      
          // TEMP: Log raw price from content script
          console.log("[Popup] Raw price from content script:", item.price);
      
          setScrapedItem?.(prev => ({
            ...prev,
            name: item.name,
            price: standardizePrice(item.price),
            url: item.url,
            image: item.image,
            notes: item.notes ?? prev?.notes ?? "",
            pageConfidence: item.pageConfidence,
            nameConfidence: item.nameConfidence,
            priceConfidence: item.priceConfidence,
            imageConfidence: item.imageConfidence,
          }));
        } catch (err: any) {
          const errorMessage = err?.message || "Error scraping item";
          notify("error", errorMessage);
        }
      };

    const addItem = async(scrapedItem: ScrapedItemType, selectedCartIds: string[]) => {
        if (isLoading || !isAuthenticated) return;
        if(!scrapedItem.name || !scrapedItem.price || !scrapedItem.image || !scrapedItem.url) {
            notify("error", "Error adding item");
            return;
        }

        if (selectedCartIds.length === 0) {
            notify("error", "Select at least one cart");
            return;
        }

        try {
            const data = { scrapedItem, selectedCartIds };
            const res = await sendChromeMessage<{item: ItemType}>({action: "addItem", data});
            upsertItemUI(res.item);
            selectedCartIds.forEach(cartId => addItemToCartUI(cartId, res.item.item_id));
            setAddItemVisible?.(false);
            notify("success", "Item added successfully");
        } catch(err) {
            notify("error", "Error adding item");
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
            notify("error", "Error editing note");
        }
    }

    const moveItem = async(itemId: string, selectedCarts: string[]) => {
        if(isLoading || !isAuthenticated) return;
        
        try {
            const data = {itemId, selectedCarts};
            await sendChromeMessage({action: "moveItem", data});
            moveItemBetweenCartsUI(itemId, selectedCarts);
        } catch (err) {
            notify("error", "Error moving item");
        }
    }

    const deleteItem = async(cartId: string, itemId: string) => {
        if(isLoading || !isAuthenticated) return;

        try {
            const data = {cartId , itemId};
            await sendChromeMessage({action: "deleteItem", data});
            removeItemFromCartUI(cartId, itemId)
        } catch (err) {
            notify("error", "Error deleting item");
        }
    }

    const deleteItemAll = async(itemId: string) => {
        if(isLoading || !isAuthenticated) return;

        try {
            const data = { itemId };
            await sendChromeMessage({action: "deleteItemAll", data});
            removeItemFromAllCartsUI(itemId);
        } catch (err) {
            notify("error", "Error deleting item");
        }
    }

    return { getItems, addItem, scrapeItem, editItem, moveItem, deleteItem, deleteItemAll};
}

export default useItemActions;