import { useCarts } from "@/popup/context/CartsProvider";
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
    const { updateCarts } = useCarts();
    
    const getItems = async(cartId : string) => {
        if (isLocked || isLoading || !isAuthenticated) return;
        if (isExpanded) { setIsExpanded?.(false); return; }

        setIsCartLoading?.(true);
        setIsExpanded?.(true);

        try {
            const data = { cartId }
            const res = await sendChromeMessage<{items: ItemType[]}>({action: "getItems", data});

            setItems?.(res.items);
        } catch (err) {
            console.error(err);
        }

        setIsCartLoading?.(false);
    };

    const editItem = async(itemNote: string, itemId: string) => {
        if (isLoading || !isAuthenticated) return;

        try {
            const data = {notes: itemNote.trim(), itemId};
            await sendChromeMessage({action: "editItem", data})
        } catch(err) {
            console.error(err);
        }
    }

    const moveItem = async(item: ItemType, selectedCarts: string[]) => {
        if(isLoading || !isAuthenticated) return;
        
        try {
            const data = {itemId: item.item_id, selectedCarts};
            await sendChromeMessage({action: "moveItem", data});

            const updatedItem: ItemType = {
                image: item.image,
                item_id: item.item_id,
                name: item.name,
                notes: item.notes,
                price: item.price,
                selected_cart_ids: selectedCarts,
                url: item.url,
                added_at: "",
            };
            updateCarts(updatedItem);
        } catch (err) {
            console.error(err);
        }
    }

    const deleteItem = async(cartId: string, item: ItemType) => {
        if(isLoading || !isAuthenticated) return;

        try {
            const data = {cartId , itemId: item.item_id};
            await sendChromeMessage({action: "deleteItem", data});

            const newSelectedCarts = item.selected_cart_ids = item.selected_cart_ids.filter(id=> id !== cartId);
            const updatedItem: ItemType = {
                image: item.image,
                item_id: item.item_id,
                name: item.name,
                notes: item.notes,
                price: item.price,
                selected_cart_ids: newSelectedCarts,
                url: item.url,
                added_at: "",
            }
            updateCarts(updatedItem);
        } catch (err) {
            console.error(err);
        }
    }

    const deleteItemAll = async(item: ItemType) => {
        if(isLoading || !isAuthenticated) return;

        try {
            const data = {itemId: item.item_id}
            await sendChromeMessage({action: "deleteItemAll", data})
            const updatedItem: ItemType = {
                image: item.image,
                item_id: item.item_id,
                name: item.name,
                notes: item.notes,
                price: item.price,
                selected_cart_ids: [],
                url: item.url,
                added_at: "",
            }
            updateCarts(updatedItem);
        } catch (err) {
            console.error(err);
        }
    }

    return { getItems, editItem, moveItem, deleteItem, deleteItemAll};
}

export default useItemActions;