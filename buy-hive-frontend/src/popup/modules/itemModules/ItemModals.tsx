import DeleteModal from "@/popup/modals/DeleteModal";
import MoveItemModal from "@/popup/modals/MoveItemModal";
import type { CartType } from "@/types/CartType";
import type { ItemType } from "@/types/ItemType";
import type { Dispatch, SetStateAction } from "react";

interface ItemModalsProps {
    cart: CartType;
    item: ItemType;

    setItemDropdownVisible: Dispatch<SetStateAction<boolean>>;
    setItemDropdownHidden: Dispatch<SetStateAction<boolean>>;

    moveItemModal: boolean;
    setMoveItemModal: Dispatch<SetStateAction<boolean>>;
    moveItemModalRef: React.RefObject<HTMLElement | null>;

    deleteItemModal: boolean;
    setDeleteItemModal: Dispatch<SetStateAction<boolean>>;
    deleteItemModalRef: React.RefObject<HTMLElement | null>;
    
    updateCarts;
}

const ItemModals = ({ 
    cart, 
    item,
    setItemDropdownVisible, 
    setItemDropdownHidden,
    moveItemModal, 
    setMoveItemModal,
    moveItemModalRef,
    deleteItemModal,
    setDeleteItemModal,
    deleteItemModalRef,
    updateCarts,
} : ItemModalsProps) => {
    return (
        <>
            {moveItemModal && <MoveItemModal 
                item={item}
                setDropdownHidden={setItemDropdownHidden}
                setDropdownVisible={setItemDropdownVisible}
                moveItemModal={moveItemModal}
                setMoveItemModal={setMoveItemModal}
                moveItemModalRef={moveItemModalRef}

            />}
            {deleteItemModal && <DeleteModal 
                cart={cart}
                item={item}
                setDropdownVisible={setItemDropdownVisible}
                setDropdownHidden={setItemDropdownHidden}
                setDeleteModal={setDeleteItemModal}
                deleteModalRef={deleteItemModalRef}
                type="item"
                updateCarts={updateCarts}
            />}
        </>
    )
}

export default ItemModals;