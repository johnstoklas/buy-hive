import type { CartType } from "@/types/CartType";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";

interface CartTitleProps {
    cart: CartType;
    isExpanded: boolean;
    setIsExpanded;
    isLocked: boolean;
    setItems;
    folderRef;
}

const CartTitle = ({cart, isExpanded, setIsExpanded, isLocked, setItems, folderRef} : CartTitleProps) => {

    const { isAuthenticated } = useAuth0();
    const { cart_id: cartId, cart_name, item_count } = cart;
    const [isEditing, setIsEditing] = useState(false); 
    const [cartTitle, setCartTitle] = useState(cart_name);

    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleTitleClick = () => {
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

    return (
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
                    className="expand-section-title-input"
                    value={cartTitle}
                    onChange={(e) => {setCartTitle(e.target.value)}}
                    //   onBlur={handleTitleBlur}
                    //   onKeyDown={handleTitleKeyDown}
                    />
                ) : (
                    <h4 className="expand-section-title" onDoubleClick={handleTitleClick}>
                        {cartTitle}
                    </h4>
                )}
            </div>

            <div className="flex flex-row gap-2 items-center">
                <h4 className="bg-[var(--accent-color)] px-3 py-1 rounded-md">{item_count}</h4>
                <button 
                    className={!isLocked ? "text-base hover:cursor-pointer" : "expand-section-modify disabled-hover-modify"} 
                    // onClick={handleModifyClick}
                >
                    &#8942;
                </button>
            </div>
        </div>
    )
}

export default CartTitle;