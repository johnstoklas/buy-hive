import { useCarts } from "@/popup/context/CartsProvider";
import { useItems } from "@/popup/context/ItemsProvder";
import { useLocked } from "@/popup/context/LockedProvider";
import { sendChromeMessage } from "@/services/chromeService";
import type { ItemType } from "@/types/ItemTypes";
import { useAuth0 } from "@auth0/auth0-react";
import type { Dispatch, SetStateAction } from "react";

interface useItemActionsProps {
    isExpanded?: boolean;
    setIsExpanded?: Dispatch<SetStateAction<boolean>>; 
    setItems?: Dispatch<SetStateAction<ItemType[]>>; 
    setIsCartLoading?: Dispatch<SetStateAction<boolean>>; 
}
export function useItemActions({ isExpanded, setIsExpanded, setItems, setIsCartLoading } : useItemActionsProps = {}) {
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

    return { getItems, editItem, moveItem, deleteItem, deleteItemAll};
}

export default useItemActions;