import { useCarts } from "@/popup/context/CartsProvider";
import { useLocked } from "@/popup/context/LockedProvider";
import { sendChromeMessage } from "@/services/chromeService";
import { useAuth0 } from "@auth0/auth0-react";

export function useCartActions({ setIsEditing }) {
    const { carts, setCarts } = useCarts();
    const { isLoading, isAuthenticated } = useAuth0();
    const { isLocked } = useLocked();
    
    const handleEditCartName = async({cartId, cartTitle}) => {

        if (isLocked || isLoading || !isAuthenticated || !cartId) return;
        if (!cartTitle.trim()) return;

        const isDuplicate = carts.some(
            (cart) => cart.cart_name === cartTitle.trim() && cart.cart_id !== cartId
        );
        if (isDuplicate) return;

        setIsEditing(false);

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

    return { handleEditCartName };
}

export default useCartActions;