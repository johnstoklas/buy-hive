import type { ItemType, ScrapedItemType } from "@/types/ItemTypes";
import type { RefObject } from "react";

interface itemHeaderProps {
    item: ItemType | ScrapedItemType;
    itemHeaderRef: RefObject<HTMLDivElement | null> | undefined;
}

const itemHeader = ({ item, itemHeaderRef } : itemHeaderProps) => {
    return (
        <div 
            className="flex flex-col flex-1 min-w-0"
            ref={itemHeaderRef}
        >
            <p className="truncate text-xs font-medium"> {item.name} </p>
            <p className="text-xs">  {item.price} </p>
        </div>
    )
}

export default itemHeader;