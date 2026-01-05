import { useLocked } from '@/popup/context/LockedContext/useLocked';
import DropdownButton from '@/popup/ui/dropdownUI/dropdownButton';
import type { ItemType } from '@/types/ItemTypes';
import { useState, useEffect, useRef } from 'react';
import ItemDropdown from './ItemDropdown';
import type { CartType } from '@/types/CartType';
import Image from '@/popup/ui/itemUI/itemImage';
import ItemHeader from '@/popup/ui/itemUI/itemHeader';
import ItemNote from '@/popup/ui/itemUI/itemNote';
import useItemActions from '@/hooks/useItemActions';
import { onNotShiftEnter } from '@/utils/keyboard';
// import ModifyItemSec from './ModifyItemSec.jsx';
// import { useLocked } from '../contexts/LockedProvider.jsx'
// import { userDataContext } from '../contexts/UserProvider.jsx';

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
    const itemRef = useRef<HTMLDivElement>(null);

    const { isLocked } = useLocked();

    useEffect(() => {
        setItemNote(item.notes || "");
        prevNoteRef.current = item.notes || "";
    }, [item.notes]);

    useEffect(() => {
        if (isEditing && itemNoteRef.current) {
            itemNoteRef.current.focus();
        }
    }, [isEditing]);

    const handleItemNoteSelect = () => {
        if (isLocked) return;
        setIsEditing(true);
        setItemDropdownVisible(false);
    };

    // Edit item notes
    const { editItem } = useItemActions();

    useEffect(() => {
        if (isEditing && itemNoteRef.current) {
            const length = itemNoteRef.current.value.length;
            itemNoteRef.current.setSelectionRange(length, length); 
            itemNoteRef.current.focus();
        }
    }, [isEditing]);

    const handleSubmit = () => {
        if (itemNote.trim() === prevNoteRef.current.trim()) return;
        editItem(itemNote, itemId);
        setIsEditing(false);
    }

    return (
        <div 
            className="flex flex-row px-2 py-2 gap-2 border border-[var(--secondary-background-hover)] rounded-md"
            ref={itemRef}
        >
            {!isLocked ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {<Image 
                        item={item}
                    />}
                </a>
                ) : (
                    <Image 
                        item={item}
                    />
            )}

            <div className='flex flex-1 flex-col overflow-hidden gap-1'>
                <div className='flex flex-row gap-1'>
                    <ItemHeader
                        item={item}
                    />
                    <DropdownButton
                        dropdownVisible={itemDropdownVisible}
                        setDropdownVisible={setItemDropdownVisible}
                        buttonRef={itemDropdownButtonRef}
                    />
                </div>
                <ItemNote
                    isEditing={isEditing}
                    noteRef={itemNoteRef}
                    noteValue={itemNote}
                    setNoteValue={(e) => setItemNote(e.target.value)}
                    handleBlur={() => handleSubmit}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) =>
                        onNotShiftEnter(e, handleSubmit)
                    }
                    handleNoteSelect={handleItemNoteSelect}
                />
            </div>
            {itemDropdownVisible && <ItemDropdown 
                cart={cart}
                item={item}
                itemDropdownVisible={itemDropdownVisible}
                setItemDropdownVisible={setItemDropdownVisible}
                itemDropdownButtonRef={itemDropdownButtonRef}
                handleItemNoteSelect={handleItemNoteSelect}
                parentRef={itemRef}
            />}
        </div>
    )
};

export default Item;
