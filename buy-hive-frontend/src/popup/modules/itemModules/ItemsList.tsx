import type { ItemType } from "@/types/ItemType";
import Item from "./Item";
import type { CartType } from "@/types/CartType";

interface ItemsListProp {
    cart: CartType;
    items: ItemType[];
    updateCarts;
}

const ItemsList = ({ cart, items, updateCarts } : ItemsListProp) => {
    return (
        <div className="flex flex-col bg-[var(--secondary-background)] -mt-3 pt-3 pb-3 shadow-bottom rounded-lg px-4 gap-2">
            {items && items.map((item) => (
                <Item
                    cart={cart}
                    item={item}
                    updateCarts={updateCarts}
                    // key={item.item_id}
                    // item={item}
                    // cartId={sectionId}
                    // itemId={item.item_id}
                    // cartsArray={organizationSections}
                    // itemsInFolder={itemsInFolder} 
                    // setItemsInFolder={setItemsInFolder}
                    // showNotification={showNotification}
                />
                ))
            }
        </div> 
    )
}

export default ItemsList;