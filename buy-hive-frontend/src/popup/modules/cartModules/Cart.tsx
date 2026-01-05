import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
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

    const [sectionHeight, setSectionHeight] = useState("45px");
    const [modOrgHidden, setModOrgHidden] = useState(false);
    const [modifyOrgSecPosition, setModifyOrgSecPosition] = useState("below");
    const [isCartLoading, setIsCartLoading] = useState(false);
    

    const itemsListRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLDivElement>(null);
    const folderRef = useRef(null);
    const inputRef = useRef(null);
    // const folderTitleRef = useRef(title);

    const { isLocked } = useLocked();

    const [isExpanded, setIsExpanded] = useState(false);

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
                folderRef={folderRef}
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