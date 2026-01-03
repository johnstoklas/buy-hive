import type { ItemType } from "@/types/ItemType";

interface itemHeaderProps {
    item: ItemType
}

const itemHeader = ({ item } : itemHeaderProps) => {
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <h4 className="whitespace-nowrap text-ellipsis overflow-hidden text-xs font-medium"> {item.name} </h4>
            <h4 className="text-xs">  {item.price} </h4>
        </div>
    )
}

export default itemHeader;