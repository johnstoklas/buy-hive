import { useState } from "react";
import type { CartType } from "@/types/CartType.js";
import CartTitle from "./CartTitle";
import ItemsList from "../itemModules/ItemsList";
import { useLocked } from "@/popup/context/LockedContext/useLocked";

interface CartProps {
  cart: CartType;
}

const Cart = ({cart} : CartProps) => {  
    const { isLocked } = useLocked();

    const [isCartLoading, setIsCartLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex flex-col bg-[var(--secondary-background)] shadow-bottom rounded-lg">
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
                isCartLoading={isCartLoading}
            />
        </div>
      );
}

export default Cart;