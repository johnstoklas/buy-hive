import React, { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { faPenToSquare, faShare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { DropdownMenu } from '@/popup/ui/dropdownMenu.js';
import type { ItemType } from '@/types/ItemType.js';
import { useClickOutside } from '@/popup/hooks/useClickOutside.js';
import { useLocked } from '@/popup/context/LockedProvider';
import ItemModals from './ItemModals';
import type { CartType } from '@/types/CartType';

interface ItemDropdownProps {
    cart: CartType;
    item: ItemType;
    itemDropdownVisible: boolean;
    setItemDropdownVisible: Dispatch<SetStateAction<boolean>>;
    itemDropdownButtonRef: React.RefObject<HTMLElement | null>;
    handleItemNoteSelect;
    updateCarts;
}

const ItemDropdown = ({
    cart,
    item,
    itemDropdownVisible,
    setItemDropdownVisible,
    itemDropdownButtonRef,
    handleItemNoteSelect,
    updateCarts,
} : ItemDropdownProps) => {  
        
    const [moveItemModal, setMoveItemModal] = useState(false);
    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [itemDropdownHidden, setItemDropdownHidden] = useState(false);

    const { setIsLocked } = useLocked();

    const itemDropdownRef = useRef(null);
    const moveItemModalRef = useRef(null);
    const deleteItemModalRef = useRef(null);

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
    useClickOutside(itemDropdownRef, itemDropdownVisible, setItemDropdownVisible, [itemDropdownButtonRef, moveItemModalRef, deleteItemModalRef]);

    useEffect(() => {
        setIsLocked(deleteItemModal || moveItemModal);
    }, [deleteItemModal, moveItemModal]);

    return (
        <>
            <ItemModals
                cart={cart}
                item={item}
                setItemDropdownVisible={setItemDropdownVisible}
                setItemDropdownHidden={setItemDropdownHidden}
                moveItemModal={moveItemModal}
                setMoveItemModal={setMoveItemModal}
                moveItemModalRef={moveItemModalRef}
                deleteItemModal={deleteItemModal}
                setDeleteItemModal={setDeleteItemModal}
                deleteItemModalRef={deleteItemModalRef}
                updateCarts={updateCarts}
            /> 
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