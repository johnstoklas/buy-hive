import React, { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { faPenToSquare, faShare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { DropdownMenu } from '@/popup/ui/dropdownUI/dropdownMenu.js';
import type { ItemType } from '@/types/ItemTypes.js';
import { useLocked } from '@/popup/context/LockedContext/useLocked';
import type { CartType } from '@/types/CartType';
import DeleteModal from '@/popup/modals/DeleteModal';
import MoveItemModal from '@/popup/modals/MoveItemModal';
import { useClickOutside } from '@/hooks/useClickOutside';

interface ItemDropdownProps {
    cart: CartType;
    item: ItemType;
    itemDropdownVisible: boolean;
    setItemDropdownVisible: Dispatch<SetStateAction<boolean>>;
    itemDropdownButtonRef: React.RefObject<HTMLElement | null>;
    handleItemNoteSelect;
}

const ItemDropdown = ({
    cart,
    item,
    itemDropdownVisible,
    setItemDropdownVisible,
    itemDropdownButtonRef,
    handleItemNoteSelect,
} : ItemDropdownProps) => {  
        
    const [moveItemModal, setMoveItemModal] = useState(false);
    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [itemDropdownHidden, setItemDropdownHidden] = useState(false);

    const { setIsLocked } = useLocked();

    const itemDropdownRef = useRef(null);
    const moveItemModalRef = useRef(null);
    const deleteItemModalRef = useRef(null);
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
                moveItemModal={moveItemModal}
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
                className={"mt-6 mr-9"}
            />
        </>
    );
};

export default ItemDropdown;