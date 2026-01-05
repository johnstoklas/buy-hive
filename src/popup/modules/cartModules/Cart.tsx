import { useState, useRef, useEffect } from "react";
import type { CartType } from "@/types/CartType.js";
import CartTitle from "./CartTitle";
import ItemsList from "../itemModules/ItemsList";
import { useLocked } from "@/popup/context/LockedContext/useLocked";
import { useItems } from "@/popup/context/ItemContext/useItem";

interface CartProps {
  cart: CartType;
}

const Cart = ({cart} : CartProps) => {  
    const { items } = useItems();
    const { isLocked } = useLocked();

    const [isCartLoading, setIsCartLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const itemsListRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = itemsListRef.current
        if (!el) return;

        if (isExpanded) {
            el.style.maxHeight = el.scrollHeight + "px";
        } else {
            el.style.maxHeight = "0px";
        }
    }, [isCartLoading, isExpanded, items]);

    return (
        <div 
            className="flex flex-col"
            ref={cartRef}
        >
            <CartTitle 
                cart={cart}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                isLocked={isLocked}
                setIsCartLoading={setIsCartLoading}
            />
            <ItemsList 
                cart={cart}
                isExpanded={isExpanded}
                itemsListRef={itemsListRef}
            />
        </div>
      );
}

export default Cart;