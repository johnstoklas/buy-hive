import DeleteCartModal from "@/popup/modals/DeleteCartModal";
import ShareCartModal from "@/popup/modals/ShareCartModal";
import type { CartType } from "@/types/CartType";
import type { Dispatch, SetStateAction } from "react";

interface CartModalsProps {
    cart: CartType;
    setCartDropdownVisible: Dispatch<SetStateAction<boolean>>;
    setCartDropdownHidden: Dispatch<SetStateAction<boolean>>;
    
    shareCartModal: boolean;
    setShareCartModal: Dispatch<SetStateAction<boolean>>;
    shareCartModalRef: React.RefObject<HTMLElement | null>;

    deleteCartModal: boolean;
    setDeleteCartModal: Dispatch<SetStateAction<boolean>>;
    deleteCartModalRef: React.RefObject<HTMLElement | null>;
}

const CartModals = ({ 
    cart, 
    setCartDropdownVisible, 
    setCartDropdownHidden,
    deleteCartModal,
    setDeleteCartModal,
    deleteCartModalRef,
    shareCartModal, 
    setShareCartModal, 
    shareCartModalRef,
} : CartModalsProps) => {
    return (
        <>
            {deleteCartModal && <DeleteCartModal
                cart={cart}
                setCartDropdownVisible={setCartDropdownVisible}
                setCartDropdownHidden={setCartDropdownHidden}
                setDeleteCartModal={setDeleteCartModal}
                deleteCartModalRef={deleteCartModalRef}
            />}
            {shareCartModal && <ShareCartModal 
                cart={cart}
                setCartDropdownVisible={setCartDropdownVisible}
                setCartDropdownHidden={setCartDropdownHidden}
                setShareCartModal={setShareCartModal}
                shareCartModalRef={shareCartModalRef}
            />}
        </>
    )
}

export default CartModals;