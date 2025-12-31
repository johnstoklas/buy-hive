import type { ItemType } from "@/types/ItemType";
import Item from "./Item";

interface ItemsListProp {
    items: ItemType[];
}

const ItemsList = ({items} : ItemsListProp) => {
    return (
        <div className="expand-section-expanded-display">
            {items && items.map((item) => (
                <Item
                    item={item}
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