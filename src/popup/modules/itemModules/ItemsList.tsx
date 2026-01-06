import { type RefObject } from "react";

import type { ItemType } from "@/types/ItemTypes";
import type { CartType } from "@/types/CartType";

import Item from "./Item";
import { useItems } from "@/popup/context/ItemContext/useItem";

interface ItemsListProp {
    cart: CartType;
    isExpanded: boolean;
    itemsListRef: RefObject<HTMLDivElement | null>;
}

const ItemsList = ({ cart, isExpanded, itemsListRef } : ItemsListProp) => {
    const { items } = useItems();

    const cartItems = cart.item_ids
        .map(id => items.find(item => item.item_id === id))
        .filter((item): item is ItemType => item !== undefined);

    return (
        <div
            ref={itemsListRef}
            // className={`${isExpanded ? "-mt-2" : ""}`}
        >
            <div 
                className="flex flex-col bg-[var(--secondary-background)] py-3 px-4 gap-2"
            >
                {cartItems && cartItems.map(item => (
                    <Item
                        key={item.item_id}
                        cart={cart}
                        item={item}
                    />
                ))}
            </div> 
        </div>
    )
}

export default ItemsList;