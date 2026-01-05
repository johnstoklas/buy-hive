import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faFolder, faUser } from '@fortawesome/free-solid-svg-icons'
import type { Dispatch, SetStateAction } from 'react';

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
    const togglePage = (type: string) => {
        setAccountPageVisible(false);
        setAddCartVisible(false);
        setAddItemVisible(false);
        if (type === "cart") setAddCartVisible(!addCartVisible);
        if (type === "account") setAccountPageVisible(!accountPageVisible);
        if (type === "item") setAddItemVisible(!addItemVisible);
    }

    return (
        <footer className="flex justify-between w-full h-14 items-center px-10 text-xl shadow-top z-50">
            <button 
                className='hover:cursor-pointer'
                onClick={() => togglePage("item")}
                ref={addItemButtonRef}
            >
                <FontAwesomeIcon icon={faCartShopping} />    
            </button>
            <button 
                className='hover:cursor-pointer'
                onClick={() => togglePage("cart")}
                ref={addCartButtonRef}
            >
                <FontAwesomeIcon icon={faFolder} />
            </button>
            <button 
                className='hover:cursor-pointer'
                onClick={() => togglePage("account")}
            >
                <FontAwesomeIcon icon={faUser} />
            </button>
        </footer>
    );
}

export default Footer;