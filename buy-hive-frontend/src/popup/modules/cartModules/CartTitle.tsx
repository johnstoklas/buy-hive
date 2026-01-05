import type { CartType } from "@/types/CartType";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import CartDropdown from "./CartDropdown";
import DropdownButton from "@/popup/ui/dropdownUI/dropdownButton";
import { onEnter } from "@/utils/keyboard";
import useCartActions from "@/hooks/useCartActions";
import useItemActions from "@/hooks/useItemActions";

interface CartTitleProps {
    cart: CartType;
    isExpanded: boolean;
    setIsExpanded: Dispatch<SetStateAction<boolean>>;
    isLocked: boolean;
    setIsCartLoading: Dispatch<SetStateAction<boolean>>;
}

const CartTitle = ({cart, isExpanded, setIsExpanded, isLocked, setIsCartLoading} : CartTitleProps) => {    
    const [isEditing, setIsEditing] = useState(false); 
    const [cartTitle, setCartTitle] = useState(cart.cart_name);
    const [cartDropdownVisible, setCartDropdownVisible] = useState(false);

    const cartDropdownButtonRef = useRef(null);
    const cartTitleRef = useRef<HTMLInputElement>(null);

    const { renameCart } = useCartActions({ setIsEditing });
    const { getItems } = useItemActions({isExpanded, setIsExpanded, setIsCartLoading});

    useEffect(() => {
        if (isEditing && cartTitleRef.current) {
            cartTitleRef.current.focus();
        }
    }, [isEditing]);

    const handleCartTitleSelect = () => {
        if (isLocked) return;
        setIsEditing(true);
        setCartDropdownVisible(false);
    };

    return (
        <>
            <div 
                className="flex flex-row gap-2 justify-between bg-[var(--secondary-background)] py-2 px-3 w-full rounded-lg shadow-bottom"
                key={cart.cart_id} 
                ref={cartTitleRef}
            >
                <div className="flex flex-row gap-2 items-center">
                    <button
                        className={
                            `hover:cursor-pointer transition-transform duration-500 ease-in-out
                            ${isExpanded ? "rotate-open-cart" : ""} 
                            ${isLocked ? "disabled-hover-modify" : ""}`
                        }          
                        onClick={() => getItems(cart.cart_id, cart.item_count)}
                    >
                        ▶
                    </button>

                    {isEditing ? (
                        <input
                            ref={cartTitleRef}
                            type="text"
                            className="bg-[var(--input-color)] rounded-sm px-2 py-1"
                            value={cartTitle}
                            onChange={(e) => {setCartTitle(e.target.value)}}
                            onBlur={() => renameCart(cart.cart_id, cartTitle)}
                            onKeyDown={(e) => onEnter(e, () => renameCart(cart.cart_id, cartTitle))}
                        />
                    ) : (
                        <h4 className="px-2 py-1" onDoubleClick={handleCartTitleSelect}>
                            {cartTitle}
                        </h4>
                    )}
                </div>

                <div className="flex flex-row gap-2 items-center">
                    <h4 className="bg-[var(--accent-color)] px-3 py-1 rounded-md">{cart.item_count}</h4>
                    <DropdownButton
                        dropdownVisible={cartDropdownVisible}
                        setDropdownVisible={setCartDropdownVisible}
                        buttonRef={cartDropdownButtonRef}
                    />
                </div>
            </div>
            {cartDropdownVisible && <CartDropdown 
                cart={cart}
                cartDropdownVisible={cartDropdownVisible}
                setCartDropdownVisible={setCartDropdownVisible}
                cartDropdownButtonRef={cartDropdownButtonRef}
                handleCartTitleSelect={handleCartTitleSelect}
                parentRef={cartTitleRef}
            />}
        </>
    )
}

export default CartTitle;