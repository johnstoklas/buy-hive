import { useLocked } from "@/popup/context/LockedContext/useLocked";
import type { ItemType, ScrapedItemType } from "@/types/ItemTypes";
import ItemImage from "./itemImage";
import ItemHeader from "./itemHeader";
import DropdownButton from "../dropdownUI/dropdownButton";
import ItemNote from "./itemNote";
import type { Dispatch, RefObject, SetStateAction, KeyboardEvent, ChangeEventHandler } from "react";
import LoadingBar from "../loadingUI/loadingBar";

type ItemUIProps =
    | {
        item: ItemType
        isClickable?: boolean;
        hasDropdown: true;
        itemDropdownVisible: boolean;
        setItemDropdownVisible: Dispatch<SetStateAction<boolean>>;
        itemDropdownButtonRef: RefObject<HTMLButtonElement | null>;
        isEditing: boolean;
        noteRef: RefObject<HTMLTextAreaElement | null> | null;
        noteValue: string;
        setNoteValue: ChangeEventHandler<HTMLTextAreaElement>;
        handleBlur: () => void;
        onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
        handleNoteSelect: () => void;
        placeholder?: string;
    }
    | {
        item: ItemType | ScrapedItemType;
        isClickable?: boolean;
        hasDropdown?: false;
        itemDropdownVisible?: never;
        setItemDropdownVisible?: never;
        itemDropdownButtonRef?: never;
        isEditing?: boolean;
        noteRef?: RefObject<HTMLTextAreaElement | null> | null;
        noteValue: string;
        setNoteValue?: ChangeEventHandler<HTMLTextAreaElement>;
        handleBlur?: () => void;
        onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
        handleNoteSelect?: () => void;
        placeholder?: string;
    }

const ItemUI = ({
    item, 
    isClickable, 
    hasDropdown, 
    itemDropdownVisible, 
    setItemDropdownVisible, 
    itemDropdownButtonRef,
    isEditing,
    noteRef,
    noteValue,
    setNoteValue,
    handleBlur,
    onKeyDown,
    handleNoteSelect,
    placeholder
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

            <div className='flex flex-1 flex-col overflow-hidden gap-1'>
                <div className='flex flex-row gap-1'>
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
                    {hasDropdown && <DropdownButton
                        dropdownVisible={itemDropdownVisible}
                        setDropdownVisible={setItemDropdownVisible}
                        buttonRef={itemDropdownButtonRef}
                    />}
                </div>
                <ItemNote
                    isEditing={isEditing}
                    noteRef={noteRef}
                    noteValue={noteValue}
                    setNoteValue={setNoteValue}
                    handleBlur={handleBlur}
                    onKeyDown={onKeyDown}
                    handleNoteSelect={handleNoteSelect}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}

export default ItemUI;