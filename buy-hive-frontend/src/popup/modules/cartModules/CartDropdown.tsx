import { useState, useEffect, useRef, type SetStateAction, type Dispatch } from 'react';
// import DeletePopup from './DeletePopup.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from '../../context/LockedProvider';
import { useClickOutside } from '@/popup/hooks/useClickOutside';
// import ShareFolder from './ShareFolder.jsx';

interface CartDropdownProps {
    cartDropdownVisible: boolean;
    setCartDropdownVisible: Dispatch<SetStateAction<boolean>>;
    cartDropdownButtonRef: React.RefObject<HTMLElement | null>;
    handleCartTitleSelect;
}

const CartDropdown = ({
    cartDropdownVisible, 
    setCartDropdownVisible, 
    cartDropdownButtonRef, 
    handleCartTitleSelect
} : CartDropdownProps) => {

    const [deletePopupVisible, setDeletePopupVisible] = useState(false);
    const [sharePopupVisible, setSharePopupVisible] = useState(false);

    const { isLocked, setIsLocked } = useLocked();

    const cartDropdownRef = useRef(null);

    // Handles if user clicks outside of the component
    useClickOutside(cartDropdownRef, cartDropdownVisible, setCartDropdownVisible, [cartDropdownButtonRef]);

    useEffect(() => {
        setIsLocked(deletePopupVisible || sharePopupVisible);
    }, [deletePopupVisible, sharePopupVisible]);
  
    // Updates if modification screen should be visible when another popup appears
    //   useEffect(() => {
    //       setModOrgHidden(deletePopupVisible || sharePopupVisible);
    //   }, [deletePopupVisible, sharePopupVisible]);

    return (
        <>
            {/* {sharePopupVisible && <ShareFolder 
            setIsVisible={setSharePopupVisible}
            setSec={setModifyOrgSec}
            setSecHidden={setModOrgHidden}
            cartId={cartId}
            cartName={cartName}
            showNotification={showNotification}
            />}
            {deletePopupVisible && <DeletePopup 
            setIsVisible={setDeletePopupVisible}
            setSec={setModifyOrgSec}
            setSecHidden={setModOrgHidden}
            cartId={cartId}
            type={"folder"}
            setOrganizationSections={setOrganizationSections}
            />} */}

            <div 
                className="flex flex-col absolute gap-1 py-1 right-0 my-1 rounded-md bg-[var(--secondary-background)]" 
                // ${modOrgHidden ? "hidden" : ""} ${position === 'above' ? "above" : "" }
                ref={cartDropdownRef} 
            >
                <button 
                    className="flex flex-row items-center px-2 py-1 hover:bg-[var(--secondary-background-hover)] hover:cursor-pointer"
                    onClick={() => handleCartTitleSelect()}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <p> Edit </p>
                </button>
                <button 
                    className="flex flex-row items-center px-2 py-1 hover:bg-[var(--secondary-background-hover)] hover:cursor-pointer"
                    onClick={() => setSharePopupVisible(!sharePopupVisible)}
                >
                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                    <p> Share </p>
                </button>
                <button     
                    className="flex flex-row items-center px-2 py-1 hover:bg-[var(--secondary-background-hover)] hover:cursor-pointer"
                    onClick={() => setDeletePopupVisible(!deletePopupVisible)}
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                    <p> Delete </p>
                </button>
            </div>
        </>
    );
};

export default CartDropdown;
