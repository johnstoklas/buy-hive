import { useState, useEffect, useRef, type SetStateAction, type Dispatch } from 'react';
// import DeletePopup from './DeletePopup.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from '../../context/LockedProvider';
import { useClickOutside } from '@/popup/hooks/useClickOutside';
import type { CartType } from '@/types/CartType';
import CartModals from './CartModals';
import { DropdownMenu } from '@/popup/ui/dropdownMenu';
// import ShareFolder from './ShareFolder.jsx';

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
            <CartModals 
                cart={cart}
                setCartDropdownVisible={setCartDropdownVisible}
                setCartDropdownHidden={setCartDropdownHidden}
                deleteCartModal={deleteCartModal}
                setDeleteCartModal={setDeleteCartModal}
                deleteCartModalRef={deleteCartModalRef}
                shareCartModal={shareCartModal}
                setShareCartModal={setShareCartModal}
                shareCartModalRef={shareCartModalRef}
            />
            <DropdownMenu
                actions={cartActions}
                hidden={cartDropdownHidden}
                dropdownRef={cartDropdownRef}
            />
        </>
    );
};

export default CartDropdown;
