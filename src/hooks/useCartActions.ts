import type { Dispatch, SetStateAction } from "react";

import { useCarts } from "@/popup/context/CartContext/useCart";
import { useLocked } from "@/popup/context/LockedContext/useLocked";
import { useAuth0 } from "@auth0/auth0-react";

import type { CartType } from "@/types/CartType";

import { sendChromeMessage } from "@/services/chromeService";
import { useAlert } from "@/popup/context/AlertContext/useAlert";

interface useCartActionsProps {
    setIsEditing?: Dispatch<SetStateAction<boolean>>;
    closePopup?: () => void;
    setPopupLoading?: Dispatch<SetStateAction<boolean>>;
    setCartName?: Dispatch<SetStateAction<string>>;
    cartTitlePrev?: string;
}

export function useCartActions({ setIsEditing, closePopup, setPopupLoading, setCartName } : useCartActionsProps = {}) {
    const { carts, hydrateCartsUI, upsertCartUI, renameCartUI, deleteCartUI } = useCarts();
    const { isLoading, isAuthenticated } = useAuth0();
    const { isLocked } = useLocked();
    const { notify } = useAlert();
    
    const getCarts = async() => {
        if (isLoading || !isAuthenticated) return;
        setPopupLoading?.(true);

        try {
            const res = await sendChromeMessage<{carts: CartType[]}>({action: "getCarts"});
            hydrateCartsUI(res.carts || []);
        } catch (err) {
            notify("error", "Error getting user data");
        }

        setPopupLoading?.(false);
    }

    const addCart = async(cartName: string) => {
        if(isLoading || !isAuthenticated) return;

        const trimmedCartName = cartName.trim();
        const isDuplicate = carts.some((cart) => cart.cart_name === trimmedCartName);

        if (isDuplicate || !trimmedCartName) {
            notify("error", "Invalid cart name");
            return;
        }

        try {
            const data = { cartName: trimmedCartName };
            const newCart = await sendChromeMessage({action: "addCart", data})
            upsertCartUI(newCart);
            setCartName?.("");
        } catch (err) {
            notify("error", "Error adding cart");
        }
    }

    const renameCart = async(cartId: string, cartTitle: string) => {
        if (isLocked || isLoading || !isAuthenticated) return;

        const isDuplicate = carts.some((cart) => cart.cart_name === cartTitle && cartId !== cart.cart_id);
        if (isDuplicate) {
            notify("error", "Invalid cart name");
            return;
        }

        setIsEditing?.(false);

        try {
            const newCartName = cartTitle.trim()
            const data = {cartId, newCartName}
            await sendChromeMessage({action: "editCartName", data});
            renameCartUI(cartId, newCartName);
        } catch (err) {
            notify("error", "Error editing cart name");
        }
    };

    const shareCart = async(email: string, cartId: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) return;

        try {
            const data = { cartId: cartId, recipient: email};
            await sendChromeMessage({action: "shareCart", data});
            // setIsLoading(false);
            closePopup?.();  
            // showNotification("Email succesfully sent!", true);
        } catch (err) {
            console.error(err);
            notify("error", "Error sharing cart");
        }
    }

    const deleteCart = async(cartId: string) => {
        if (isLoading || !isAuthenticated) return;

        try {
            const data = { cartId }
            await sendChromeMessage({action: "deleteCart", data});
            deleteCartUI(cartId);
        } catch (err) {
            notify("error", "Error deleting cart");
        }
    };

    return { getCarts, addCart, renameCart, shareCart, deleteCart };
}

export default useCartActions;