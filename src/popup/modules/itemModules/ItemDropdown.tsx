import { useState, useEffect, useRef, type Dispatch, type SetStateAction, type RefObject, useLayoutEffect } from 'react';
import { faPenToSquare, faShare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import type { ItemType } from '@/types/ItemTypes.js';
import { useLocked } from '@/popup/context/LockedContext/useLocked';
import type { CartType } from '@/types/CartType';
import DeleteModal from '@/popup/modals/DeleteModal';
import MoveItemModal from '@/popup/modals/MoveItemModal';
import { useClickOutside } from '@/hooks/useClickOutside';
import { DropdownMenu } from '@/popup/ui/dropdownUI/dropdownMenu';

interface ItemDropdownProps {
    cart: CartType;
    item: ItemType;
    itemDropdownVisible: boolean;
    setItemDropdownVisible: Dispatch<SetStateAction<boolean>>;
    itemDropdownButtonRef: RefObject<HTMLButtonElement | null>;
    handleItemNoteSelect: () => void;
    parentRef: RefObject<HTMLDivElement | null>;
}

const ItemDropdown = ({
    cart,
    item,
    itemDropdownVisible,
    setItemDropdownVisible,
    itemDropdownButtonRef,
    handleItemNoteSelect,
    parentRef,
} : ItemDropdownProps) => {  
        
    const [moveItemModal, setMoveItemModal] = useState(false);
    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [itemDropdownHidden, setItemDropdownHidden] = useState(false);
    const [itemDropdownPosition , setItemDropdownPosition] = useState("below");

    const { isLocked, setIsLocked } = useLocked();

    const itemDropdownRef = useRef(null);
    const moveItemModalRef = useRef<HTMLDivElement>(null);
    const deleteItemModalRef = useRef<HTMLDivElement>(null);
    const deleteItemAllModalRef = useRef(null);

    const itemActions = [
        {
            label: "Edit",
            icon: faPenToSquare,
            onClick: handleItemNoteSelect,
        },
        {
            label: "Move",
            icon: faShare,
            onClick: () => setMoveItemModal(!moveItemModal),
        },
        {
            label: "Delete",
            icon: faTrashCan,
            onClick: () => setDeleteItemModal(!deleteItemModal),
        },
    ];

    useEffect(() => {
        if (itemDropdownHidden || isLocked || !parentRef.current) return;
        const parentRect = parentRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - parentRect.bottom;

        setItemDropdownPosition(spaceBelow < 150 ? "above" : "below");
    }, []);

    // If the user clicks out of the modification pop-up it disappears
    useClickOutside(itemDropdownRef, itemDropdownVisible, setItemDropdownVisible, [itemDropdownButtonRef, moveItemModalRef, deleteItemModalRef, deleteItemAllModalRef]);

    useEffect(() => {
        setIsLocked(deleteItemModal || moveItemModal);
    }, [deleteItemModal, moveItemModal]);
    
    
    return (
        <>
            {moveItemModal && <MoveItemModal 
                cart={cart}
                item={item}
                setItemDropdownHidden={setItemDropdownHidden}
                setItemDropdownVisible={setItemDropdownVisible}
                setMoveItemModal={setMoveItemModal}
                moveItemModalRef={moveItemModalRef}
                deleteItemAllModalRef={deleteItemAllModalRef}
            />}
            {deleteItemModal && <DeleteModal 
                cart={cart}
                item={item}
                setDropdownVisible={setItemDropdownVisible}
                setDropdownHidden={setItemDropdownHidden}
                setDeleteModal={setDeleteItemModal}
                deleteModalRef={deleteItemModalRef}
                type="item"
            />}
            <DropdownMenu
                actions={itemActions}
                hidden={itemDropdownHidden}
                dropdownRef={itemDropdownRef}
                dropdownPosition={itemDropdownPosition}
            />
        </>
    );
};

export default ItemDropdown;