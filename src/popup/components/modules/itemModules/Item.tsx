import { useLocked } from '@/popup/context/LockedContext/useLocked';
import type { ItemType } from '@/types/ItemTypes';
import { useState, useEffect, useRef } from 'react';
import type { CartType } from '@/types/CartType';
import useItemActions from '@/hooks/useItemActions';
import { onNotShiftEnter } from '@/utils/keyboard';
import ItemUI from '@/popup/components/ui/itemUI/itemUI';
import DropdownButton from '@/popup/components/ui/dropdownUI/dropdownButton';
import ItemNoteEditing from '@/popup/components/ui/itemUI/itemNoteUI/itemNoteEditing';
import ItemNoteStatic from '@/popup/components/ui/itemUI/itemNoteUI/ItemNoteStatic';
import ItemDropdown from './ItemDropdown';

interface ItemProp {
    cart: CartType;
    item: ItemType;
}

const Item = ({ cart, item } : ItemProp) => {

    const {item_id: itemId} = item;

    const [itemDropdownVisible, setItemDropdownVisible] = useState(false);
    const [itemNote, setItemNote] = useState(item.notes || "");
    const [isEditing, setIsEditing] = useState(false);

    const itemNoteRef = useRef<HTMLTextAreaElement>(null);
    const prevNoteRef = useRef(item.notes || "");
    const itemDropdownButtonRef = useRef<HTMLButtonElement>(null);
    const itemHeaderRef = useRef<HTMLDivElement>(null);

    const { isLocked } = useLocked();
    const { editItem } = useItemActions();

    useEffect(() => {
        setItemNote(item.notes || "");
        prevNoteRef.current = item.notes || "";
    }, [item.notes]);

    useEffect(() => {
        if (isEditing && itemNoteRef.current) {
            itemNoteRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        if (isEditing && itemNoteRef.current) {
            const length = itemNoteRef.current.value.length;
            itemNoteRef.current.setSelectionRange(length, length); 
            itemNoteRef.current.focus();
        }
    }, [isEditing]);

    // const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});

    // useEffect(() => {
    //     if (!itemDropdownVisible || !itemDropdownButtonRef.current) return;

    //     const rect = itemDropdownButtonRef.current.getBoundingClientRect();

    //     setDropdownStyle({
    //         position: "fixed",
    //         top: rect.bottom,
    //         left: rect.right - 80,
    //     });
    // }, [itemDropdownVisible]);


    const handleItemNoteSelect = () => {
        if (isLocked) return;
        setIsEditing(true);
        setItemDropdownVisible(false);
    };

    const handleSubmit = () => {
        if (itemNote.trim() === prevNoteRef.current.trim()) return;
        editItem(itemNote, itemId);
        setIsEditing(false);
    }

    return (
        <div className="relative px-2 py-2 gap-2 border border-[var(--secondary-background-hover)] rounded-md">
            <ItemUI
                item={item}
                ref={itemHeaderRef}
                isClickable={true}
                rightSlot={
                    <>
                        <DropdownButton
                            dropdownVisible={itemDropdownVisible}
                            setDropdownVisible={setItemDropdownVisible}
                            buttonRef={itemDropdownButtonRef}
                        />
                        {itemDropdownVisible && <ItemDropdown 
                            cart={cart}
                            item={item}
                            itemDropdownVisible={itemDropdownVisible}
                            setItemDropdownVisible={setItemDropdownVisible}
                            itemDropdownButtonRef={itemDropdownButtonRef}
                            handleItemNoteSelect={handleItemNoteSelect}
                            parentRef={itemHeaderRef}
                        />}
                    </>
                }
                noteSlot={
                    isEditing ?
                        (
                            <ItemNoteEditing
                                noteRef={itemNoteRef}
                                noteValue={itemNote}
                                setNoteValue={(e) => setItemNote(e.target.value)}
                                handleBlur={handleSubmit}
                                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) =>
                                    onNotShiftEnter(e, handleSubmit)
                                }
                            />
                        ) : (
                            <ItemNoteStatic
                                noteValue={itemNote}
                                handleNoteSelect={handleItemNoteSelect}
                            />
                        )
                }
            />
        </div>
    )
};

export default Item;
