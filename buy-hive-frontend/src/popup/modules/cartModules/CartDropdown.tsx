import { useState, useEffect, useRef, type SetStateAction, type Dispatch } from 'react';
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from '../../context/LockedProvider';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { CartType } from '@/types/CartType';
import { DropdownMenu } from '@/popup/ui/dropdownUI/dropdownMenu';
import ShareCartModal from '@/popup/modals/ShareCartModal';
import DeleteModal from '@/popup/modals/DeleteModal';

interface CartDropdownProps {
    cart: CartType;
    cartDropdownVisible: boolean;
    setCartDropdownVisible: Dispatch<SetStateAction<boolean>>;
    cartDropdownButtonRef: React.RefObject<HTMLElement | null>;
    handleCartTitleSelect;
}

const CartDropdown = ({
    cart,
    cartDropdownVisible, 
    setCartDropdownVisible, 
    cartDropdownButtonRef, 
    handleCartTitleSelect
} : CartDropdownProps) => {

    const [deleteCartModal, setDeleteCartModal] = useState(false);
    const [shareCartModal, setShareCartModal] = useState(false);
    const [cartDropdownHidden, setCartDropdownHidden] = useState(false);

    const { setIsLocked } = useLocked();

    const cartDropdownRef = useRef(null);
    const deleteCartModalRef = useRef(null);
    const shareCartModalRef = useRef(null);

    const cartActions = [
        {
            label: "Edit",
            icon: faPenToSquare,
            onClick: handleCartTitleSelect,
        },
        {
            label: "Share",
            icon: faArrowUpFromBracket,
            onClick: () => setShareCartModal(true),
        },
        {
            label: "Delete",
            icon: faTrashCan,
            onClick: () => setDeleteCartModal(true),
        },
    ];

    // Handles if user clicks outside of the component
    useClickOutside(cartDropdownRef, cartDropdownVisible, setCartDropdownVisible, [cartDropdownButtonRef, deleteCartModalRef, shareCartModalRef]);

    useEffect(() => {
        setIsLocked(deleteCartModal || shareCartModal);
    }, [deleteCartModal, shareCartModal]);

    return (
        <>
            {deleteCartModal && <DeleteModal
                cart={cart}
                setDropdownVisible={setCartDropdownVisible}
                setDropdownHidden={setCartDropdownHidden}
                setDeleteModal={setDeleteCartModal}
                deleteModalRef={deleteCartModalRef}
                type="folder"
            />}
            {shareCartModal && <ShareCartModal 
                cart={cart}
                setCartDropdownVisible={setCartDropdownVisible}
                setCartDropdownHidden={setCartDropdownHidden}
                setShareCartModal={setShareCartModal}
                shareCartModalRef={shareCartModalRef}
            />}
            <DropdownMenu
                actions={cartActions}
                hidden={cartDropdownHidden}
                dropdownRef={cartDropdownRef}
            />
        </>
    );
};

export default CartDropdown;
