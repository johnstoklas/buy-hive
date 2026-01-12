import { useLocked } from "@/popup/context/LockedContext/useLocked";
import type { ItemType, ScrapedItemType } from "@/types/ItemTypes";
import ItemImage from "./itemImage";
import ItemHeader from "./itemHeader";
import LoadingBar from "../loadingUI/loadingBar";
import type { ReactNode, RefObject } from "react";

type ItemUIProps = {
    item: ItemType | ScrapedItemType;
    ref?: RefObject<HTMLDivElement | null>;
    isClickable?: boolean;
    rightSlot?: ReactNode;
    noteSlot?: ReactNode;
};

const ItemUI = ({
    item, 
    ref,
    isClickable, 
    rightSlot,
    noteSlot
} : ItemUIProps) => {

    const { isLocked } = useLocked();

    return (
        <div className="flex gap-2">
            {item.image ? (
                isLocked || !isClickable ? (
                    <ItemImage 
                        item={item}
                    />
                ) : (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {<ItemImage 
                            item={item}
                        />}
                    </a>
                )
            ) : (
                <LoadingBar 
                    className="w-20 h-20"
                />
            )}

            <div className='flex flex-col gap-1'>
                <div 
                    className='flex flex-row gap-1 overflow-x-hidden overflow-y-visible relative'
                    ref={ref}
                >
                    {item.name && item.price ? (
                        <ItemHeader
                            item={item}
                        />
                    ) : (
                        <div className="flex flex-1 flex-col gap-1">
                            <LoadingBar 
                                className="w-full h-4"
                            />
                            <LoadingBar 
                                className="w-[50%] h-4"
                            />
                        </div>
                    )}
                    {rightSlot}
                </div>
                {noteSlot}
            </div>
        </div>
    )
}

export default ItemUI;