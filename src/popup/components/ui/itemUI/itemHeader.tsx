import type { ItemType, ScrapedItemType } from "@/types/ItemTypes";
import type { RefObject, SetStateAction } from "react";

type itemHeaderProps = 
    | {
        item: ItemType | ScrapedItemType;
        setItem?: null;
        itemHeaderRef: RefObject<HTMLDivElement | null> | undefined;
        isForm?: false;
    }
    | {
        item: ItemType | ScrapedItemType;
        setItem: React.Dispatch<SetStateAction<ScrapedItemType>>;
        itemHeaderRef: RefObject<HTMLDivElement | null> | undefined;
        isForm: true; 
    };

const ItemHeader = ({ item, setItem, itemHeaderRef, isForm } : itemHeaderProps) => {
    return (
        <div className="flex flex-col flex-1 min-w-0 gap-1" ref={itemHeaderRef}>
            {isForm ? (
                <>
                    <input 
                        type="text" 
                        className="bg-[var(--input-color)] border-[var(--shadow-color)] rounded-md px-1 truncate text-xs font-medium border" 
                        defaultValue={item.name} 
                        onChange={(e) => setItem((prev) => ({
                            ...prev,        
                            name: e.target.value 
                        }))} 
                    />
                    <input 
                        type="text" 
                        className="bg-[var(--input-color)] border-[var(--shadow-color)] rounded-md px-1 text-xs border" 
                        defaultValue={item.price} 
                        onChange={(e) => setItem((prev) => ({
                            ...prev,        
                            price: e.target.value 
                        }))} 
                    />
                </>
            ) : (
                <>
                    <p className="truncate text-xs font-medium">{item.name}</p>
                    <p className="text-xs">{item.price}</p>
                </>
            )}
        </div>
    )
}

export default ItemHeader;