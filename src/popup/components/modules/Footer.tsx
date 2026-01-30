import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faFolder, faUser } from '@fortawesome/free-solid-svg-icons'
import type { Dispatch, SetStateAction } from 'react';
import { useLocked } from '../../context/LockedContext/useLocked';

interface FooterProps {
    addItemVisible: boolean;
    setAddItemVisible: Dispatch<SetStateAction<boolean>>;
    addItemButtonRef: React.RefObject<HTMLButtonElement | null>;
    
    addCartVisible: boolean;
    setAddCartVisible: Dispatch<SetStateAction<boolean>>;
    addCartButtonRef: React.RefObject<HTMLButtonElement | null>;
        
    accountPageVisible: boolean;
    setAccountPageVisible: Dispatch<SetStateAction<boolean>>;
}

const Footer = ({ 
    addItemVisible, 
    setAddItemVisible, 
    addItemButtonRef,
    addCartVisible, 
    setAddCartVisible, 
    addCartButtonRef,
    accountPageVisible, 
    setAccountPageVisible,
} : FooterProps) => {
    const { isLocked } = useLocked();

    const togglePage = (type: string) => {
        setAccountPageVisible(false);
        setAddCartVisible(false);
        setAddItemVisible(false);
        if (type === "cart") setAddCartVisible(!addCartVisible);
        if (type === "account") setAccountPageVisible(!accountPageVisible);
        if (type === "item") setAddItemVisible(!addItemVisible);
    }

    return (
        <footer className="flex justify-between w-full z-100 h-14 items-center px-10 text-xl shadow-top">
            <button 
                className={`${isLocked ? "" : "hover:cursor-pointer"}`}
                onClick={() => togglePage("item")}
                ref={addItemButtonRef}
                disabled={isLocked}
            >
                <FontAwesomeIcon icon={faCartShopping} />    
            </button>
            <button 
                className={`${isLocked ? "" : "hover:cursor-pointer"}`}
                onClick={() => togglePage("cart")}
                ref={addCartButtonRef}
                disabled={isLocked}
            >
                <FontAwesomeIcon icon={faFolder} />
            </button>
            <button 
                className={`${isLocked ? "" : "hover:cursor-pointer"}`}
                onClick={() => togglePage("account")}
                disabled={isLocked}
            >
                <FontAwesomeIcon icon={faUser} />
            </button>
        </footer>
    );
}

export default Footer;