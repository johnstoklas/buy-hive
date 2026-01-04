import type { ItemType, ScrapedItemType } from "@/types/ItemTypes";

interface itemHeaderProps {
    item: ItemType | ScrapedItemType
}

const itemHeader = ({ item } : itemHeaderProps) => {
    return (
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <p className="whitespace-nowrap text-ellipsis overflow-hidden text-xs font-medium"> {item.name} </p>
            <p className="text-xs">  {item.price} </p>
        </div>
    )
}

export default itemHeader;