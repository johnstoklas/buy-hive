import { useState, useEffect, useRef, type SetStateAction, type Dispatch, type RefObject } from 'react';
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from '../../../context/LockedContext/useLocked';
import type { CartType } from '@/types/CartType';
import ShareCartModal from '@/popup/components/modals/ShareCartModal';
import DeleteModal from '@/popup/components/modals/DeleteModal';
import { useClickOutside } from '@/hooks/useClickOutside';
import { DropdownMenu } from '@/popup/components/ui/dropdownUI/dropdownMenu';

interface CartDropdownProps {
    cart: CartType;
    cartDropdownVisible: boolean;
    setCartDropdownVisible: Dispatch<SetStateAction<boolean>>;
    cartDropdownButtonRef: React.RefObject<HTMLButtonElement | null>;
    startEditing: () => void;
    parentRef: RefObject<HTMLInputElement | null>;
}

const CartDropdown = ({
    cart,
    cartDropdownVisible, 
    setCartDropdownVisible, 
    cartDropdownButtonRef, 
    startEditing, 
    parentRef,
} : CartDropdownProps) => {

    const [deleteCartModal, setDeleteCartModal] = useState(false);
    const [shareCartModal, setShareCartModal] = useState(false);
    const [cartDropdownHidden, setCartDropdownHidden] = useState(false);
    const [cartDropdownPosition, setCartDropdownPosition] = useState<string>("below");

    const { isLocked, setIsLocked } = useLocked();

    const cartDropdownRef = useRef<HTMLDivElement>(null);
    const deleteCartModalRef = useRef<HTMLDivElement>(null);
    const shareCartModalRef = useRef<HTMLDivElement>(null);

    const cartActions = [
        {
            label: "Edit",
            icon: faPenToSquare,
            onClick: startEditing,
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

    useEffect(() => {
        if (cartDropdownHidden || isLocked || !parentRef.current) return;
        const parentRect = parentRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - parentRect.bottom;

        setCartDropdownPosition(spaceBelow < 150 ? "above" : "below");
    }, []);

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
                dropdownPosition={cartDropdownPosition}
                anchorRef={cartDropdownButtonRef}
            />
        </>
    );
};

export default CartDropdown;
