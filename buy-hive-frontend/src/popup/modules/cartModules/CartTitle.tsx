import type { CartType } from "@/types/CartType";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import CartDropdown from "./CartDropdown";
import DropdownButton from "@/popup/ui/dropdownUI/dropdownButton";
import type { ItemType } from "@/types/ItemTypes";
import { onEnter } from "@/utils/keyboard";
import useCartActions from "@/hooks/useCartActions";
import useItemActions from "@/hooks/useItemActions";

interface CartTitleProps {
    cart: CartType;
    isExpanded: boolean;
    setIsExpanded: Dispatch<SetStateAction<boolean>>;
    isLocked: boolean;
    setItems: Dispatch<SetStateAction<ItemType[]>>;
    folderRef: React.RefObject<HTMLElement | null>;
}

const CartTitle = ({cart, isExpanded, setIsExpanded, isLocked, setItems, folderRef} : CartTitleProps) => {    
    const [isEditing, setIsEditing] = useState(false); 
    const [cartTitle, setCartTitle] = useState(cart.cart_name);
    const [cartDropdownVisible, setCartDropdownVisible] = useState(false);

    const cartDropdownButtonRef = useRef(null);
    const cartTitleRef = useRef(null);

    // Handles submitting a new cart name
    const { renameCart } = useCartActions({ setIsEditing });
    // Handles getting items for a cart
    const { getItems } = useItemActions({isExpanded, setIsExpanded, setItems});

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
                className={
                    `flex flex-row gap-2 justify-between bg-[var(--secondary-background)] py-2 px-3 w-full rounded-lg 
                    ${isExpanded ? "" : "shadow-bottom"}`
                }
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
                        onClick={() => getItems(cart.cart_id)}
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
            />}
        </>
    )
}

export default CartTitle;