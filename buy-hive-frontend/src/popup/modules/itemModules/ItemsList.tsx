import type { RefObject } from "react";

import type { ItemType } from "@/types/ItemTypes";
import type { CartType } from "@/types/CartType";

import Item from "./Item";

interface ItemsListProp {
    cart: CartType;
    items: ItemType[];
    isExpanded: boolean;
    itemsListRef: RefObject<HTMLDivElement>;
}

const ItemsList = ({ cart, items, isExpanded, itemsListRef } : ItemsListProp) => {
    return (
        <div
            ref={itemsListRef}
            className={`bg-[var(--secondary-background)] shadow-bottom rounded-lg items-list-animation ${isExpanded ? "-mt-2" : ""}`}
            // style={{ maxHeight: isExpanded ? undefined : "0px" }}
        >
            <div 
                className="flex flex-col bg-[var(--secondary-background)] py-3 px-4 gap-2"
                ref={itemsListRef}
            >
                {items && items.map((item) => (
                    <Item
                        cart={cart}
                        item={item}
                    />
                ))}
            </div> 
        </div>
    )
}

export default ItemsList;