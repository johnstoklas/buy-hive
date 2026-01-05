import { useCarts } from "@/popup/context/CartsProvider";
import { useLocked } from "@/popup/context/LockedProvider";
import { sendChromeMessage } from "@/services/chromeService";
import { CartType } from "@/types/CartType";
import { useAuth0 } from "@auth0/auth0-react";
import type { Dispatch, SetStateAction } from "react";

interface useCartActionsProps {
    setIsEditing?: Dispatch<SetStateAction<boolean>>;
    closePopup?;
    setPopupLoading?: Dispatch<SetStateAction<boolean>>;
    setCartName?: Dispatch<SetStateAction<string>>;
}

export function useCartActions({ setIsEditing, closePopup, setPopupLoading, setCartName } : useCartActionsProps = {}) {
    const { carts, hydrateCartsUI, upsertCartUI, renameCartUI, deleteCartUI } = useCarts();
    const { isLoading, isAuthenticated } = useAuth0();
    const { isLocked } = useLocked();
    
    const getCarts = async() => {
        if (isLoading || !isAuthenticated) return;
        setPopupLoading?.(true);

        try {
            const res = await sendChromeMessage<{carts: CartType[]}>({action: "getCarts"});
            hydrateCartsUI(res.carts || []);
        } catch (err) {
            console.error(err);
        }

        setPopupLoading?.(false);
    }

    const addCart = async(cartName: string) => {
        if(isLoading || !isAuthenticated) return;

        const trimmedCartName = cartName.trim();
        const isDuplicate = carts.some((cart) => cart.cart_name === trimmedCartName);
        if (isDuplicate || !trimmedCartName) {
            // showNotification("Invalid Cart Name", false);
            return;
        }

        try {
            const data = { cartName: trimmedCartName };
            const newCart = await sendChromeMessage({action: "addCart", data})
            upsertCartUI(newCart);
            setCartName?.("");
        } catch (err) {
            console.error(err);
        }
    }

    const renameCart = async(cartId: string, cartTitle: string) => {
        if (isLocked || isLoading || !isAuthenticated) return;
        if (!cartTitle.trim()) return;

        const isDuplicate = carts.some((cart) => cart.cart_name === cartTitle);
        if (isDuplicate) return;

        setIsEditing?.(false);

        try {
            const newCartName = cartTitle.trim()
            const data = {cartId, newCartName}
            await sendChromeMessage({action: "editCartName", data});
            renameCartUI(cartId, newCartName);
        } catch (err) {
            console.error(err);
        }
    };

    const shareCart = async(email: string, cartId: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) return;

        try {
            const data = { cartId: cartId, recipient: email};
            await sendChromeMessage({action: "sendEmail", data});
            // setIsLoading(false);
            closePopup();  
            // showNotification("Email succesfully sent!", true);
        } catch (err) {
            console.error(err);
            // showNotification("Error sending email", false);
        }
    }

    const deleteCart = async(cartId: string) => {
        if (isLoading || !isAuthenticated) return;

        try {
            const data = { cartId }
            await sendChromeMessage({action: "deleteCart", data});
            deleteCartUI(cartId);
        } catch (err) {
            console.error(err);
        }
    };

    return { getCarts, addCart, renameCart, shareCart, deleteCart };
}

export default useCartActions;