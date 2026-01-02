import type { CartType } from "@/types/CartType";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import CartDropdown from "./CartDropdown";
import { useCarts } from "@/popup/context/CartsProvider";

interface CartTitleProps {
    cart: CartType;
    isExpanded: boolean;
    setIsExpanded: Dispatch<SetStateAction<boolean>>;
    isLocked: boolean;
    setItems: Dispatch<SetStateAction<CartType[]>>;
    folderRef: React.RefObject<HTMLElement | null>;
}

const CartTitle = ({cart, isExpanded, setIsExpanded, isLocked, setItems, folderRef} : CartTitleProps) => {

    const { carts, setCarts } = useCarts();
    const { isLoading, isAuthenticated } = useAuth0();

    const { cart_id: cartId, cart_name, item_count } = cart;
    const [isEditing, setIsEditing] = useState(false); 
    const [cartTitle, setCartTitle] = useState(cart_name);

    const [cartDropdownVisible, setCartDropdownVisible] = useState(false);
    const cartDropdownButtonRef = useRef(null);

    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleCartTitleSelect = () => {
        if (isLocked) return;
        setIsEditing(true);
        // setModifyOrgSec(false);
    };

    const handleOpenCart = () => {
        if (isLocked || !isAuthenticated) return;
        if (isExpanded) { setIsExpanded(false); return; }

        chrome.runtime.sendMessage({ action: "getItems", data: { cartId } }, (response) => {
            if (response?.status === "success") {
                const res = response.data
                setItems(res.items);
                setIsExpanded(true);
            } else {
                console.error("Error fetching data:", response?.message);
            }
        }
        );
    };

    // Handles editing a cart name
    const handleEditCartName = () => {
        if (isLoading || !isAuthenticated || !cartId) return;
        if (!cartTitle.trim()) return;

        const isDuplicate = carts.some(
            (cart) => cart.cart_name === cartTitle.trim() && cart.cart_id !== cartId
        );
        if (isDuplicate) {
            // showNotification("Invalid Cart Name", false);
            return;
        }

        const data = {
            newCartName: cartTitle.trim(),
            cartId: cartId,
        };

        chrome.runtime.sendMessage({ action: "editCartName", data }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error communicating with background script:", chrome.runtime.lastError.message);
                return;
            }

            if (response.status === "success") {
                setCarts((prev) =>
                    prev.map((cart) =>
                        cart.cart_id === cartId ? { ...cart, cart_name: cartTitle.trim() } : cart
                    )
                );
            } else {
                console.error("Error updating cart name:", response?.message);
                // showNotification("Error Editing Cart Name", false);
            }
        });
    };

    // Handles when user presses enter to submit edit name
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setIsEditing(false);
            handleEditCartName();
        }
    };

    // Handles when user selects off of input
    const handleTitleBlur = () => {
        setIsEditing(false);
        handleEditCartName();
    };

    // const handleModifyClick = () => {
    //     if (!modOrgHidden && !isLocked) {
    //         setModifyOrgSec((prev) => !prev);
    //         if (folderRef.current) {
    //             const parentRect = folderRef.current.getBoundingClientRect();
    //             const spaceBelow = window.innerHeight - parentRect.bottom;

    //             setModifyOrgSecPosition(spaceBelow < 150 ? "above" : "below");
    //         }
    //     }
    // };

    return (
        <>
            <div 
                className="flex flex-row gap-2 justify-between bg-[var(--secondary-background)] py-2 px-3 w-full shadow-bottom rounded-lg" 
                key={cartId} 
                ref={folderRef}
            >
                <div className="flex flex-row gap-2 items-center">
                    <button
                        className={`hover:cursor-pointer ${isExpanded ? "rotate" : ""} ${isLocked ? "disabled-hover-modify" : ""}`}          
                        onClick={handleOpenCart}
                    >
                        ▶
                    </button>

                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            className="bg-[#eaeaea] rounded-sm px-2 py-1"
                            value={cartTitle}
                            onChange={(e) => {setCartTitle(e.target.value)}}
                            onBlur={handleTitleBlur}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <h4 className="px-2 py-1" onDoubleClick={handleCartTitleSelect}>
                            {cartTitle}
                        </h4>
                    )}
                </div>

                <div className="flex flex-row gap-2 items-center">
                    <h4 className="bg-[var(--accent-color)] px-3 py-1 rounded-md">{item_count}</h4>
                    <button 
                        className={`text-base w-6 h-6 rounded-full hover:cursor-pointer hover:bg-[var(--secondary-background-hover)] ${isLocked ? "disabled-hover-modify" : ""}`} 
                        onClick={() => setCartDropdownVisible(!cartDropdownVisible)}
                        ref={cartDropdownButtonRef}
                    >
                        &#8942;
                    </button>
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