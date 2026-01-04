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
}

export function useCartActions({ setIsEditing, closePopup, setPopupLoading } : useCartActionsProps = {}) {
    const { carts, setCarts } = useCarts();
    const { isLoading, isAuthenticated } = useAuth0();
    const { isLocked } = useLocked();
    
    const getCarts = async() => {
        if (isLoading || !isAuthenticated) return;
        setPopupLoading?.(true);

        try {
            const res = await sendChromeMessage<{carts: CartType[]}>({action: "getCarts"});
            setCarts(res.carts || []);
        } catch (err) {
            console.error(err);
        }

        setPopupLoading?.(false);
    }

    const renameCart = async(cartId: string, cartTitle: string) => {
        if (isLocked || isLoading || !isAuthenticated) return;
        if (!cartTitle.trim()) return;

        const isDuplicate = carts.some(
            (cart) => cart.cart_name === cartTitle.trim() && cart.cart_id !== cartId
        );
        if (isDuplicate) return;

        setIsEditing?.(false);

        try {
            const data = {cartId, newCartName: cartTitle.trim()}
            await sendChromeMessage({action: "editCartName", data});

            setCarts((prev) =>
                prev.map((cart) =>
                cart.cart_id === cartId
                    ? { ...cart, cart_name: cartTitle.trim() }
                    : cart
                )
            );
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
            setCarts((prev) => prev.filter((section) => section.cart_id !== cartId));
        } catch (err) {
            console.error(err);
        }
    };

    return { getCarts, renameCart, shareCart, deleteCart };
}

export default useCartActions;