import type { ItemType } from "@/types/ItemTypes";
import type { CartType } from "@/types/CartType";

import Item from "./Item";

interface ItemsListProp {
    cart: CartType;
    items: ItemType[];
}

const ItemsList = ({ cart, items } : ItemsListProp) => {
    return (
        <div className="flex flex-col bg-[var(--secondary-background)] -mt-3 pt-3 pb-3 shadow-bottom rounded-lg px-4 gap-2">
            {items && items.map((item) => (
                <Item
                    cart={cart}
                    item={item}
                />
                ))
            }
        </div> 
    )
}

export default ItemsList;