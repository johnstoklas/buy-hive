import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { CartType } from '@/types/CartType';
import { useCarts } from '../context/CartsProvider';
import Button from '../ui/button';
import { useLocked } from '../context/LockedProvider';

interface DeletePopupProps {
    cart: CartType;
    setCartDropdownVisible: Dispatch<SetStateAction<boolean>>;
    setCartDropdownHidden: Dispatch<SetStateAction<boolean>>;
    setShareCartModal: Dispatch<SetStateAction<boolean>>;
    shareCartModalRef: React.RefObject<HTMLElement | null>;
}

const DeletePopup = ({ cart, setCartDropdownVisible, setCartDropdownHidden, setShareCartModal, shareCartModalRef } : DeletePopupProps) => {

    const { cart_id: cartId } = cart;

    const { isAuthenticated } = useAuth0(); 
    const { setCarts } = useCarts();
    const { setIsLocked } = useLocked();

    const [email, setEmail] = useState("");

    const handleSendCart = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(emailRegex.test(email)) {

        const data = { cartId: cartId, recipient: email}

        // setIsLoading(true);
        chrome.runtime.sendMessage({ action: "sendEmail", data }, (response) => {
            console.log(response);
            if (response?.status === "success") {
            // setIsLoading(false);
            closePopup();  
            // showNotification("Email succesfully sent!", true);
            } else {
            console.error("message: ", response);
            // setIsLoading(false);
            // showNotification("Error sending email", false);
            }
        });
        } else {
            console.log("invalid email");
            // showNotification("Invalid email", false);
        }
    }

    useEffect(() => {
        setCartDropdownHidden(true);
    }, [setCartDropdownHidden]);

    const closePopup = () => {
        setCartDropdownVisible(false);
        setCartDropdownHidden(false);
        setIsLocked(false);
        setShareCartModal(false);
    }

    // const handleKeyDown = (e) => {
    //     if (e.key === 'Enter') {
    //         sendEmail();
    //     }
    // };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4">
        <div 
            className="flex flex-1 flex-col relative justify-center text-center py-3 gap-2 rounded-lg bg-[var(--secondary-background)] shadow-bottom"
            ref={shareCartModalRef}
        > 
            <p className="absolute right-3 top-2 hover:cursor-pointer hover:font-bold" onClick={closePopup}> &#10005; </p>
            <p> Enter a valid email to share cart </p>
            <input 
                className="bg-[var(--input-color)] px-2 py-1 mx-4 rounded-sm"
                type="text" 
                placeholder="Enter Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                //   onKeyDown={handleKeyDown}
            />
            <div className="flex gap-2 justify-center">
                <Button 
                    onClick={handleSendCart}
                    isModal={true}
                > 
                    Send
                </Button>
                <Button 
                    onClick={closePopup}
                    isModal={true}
                > 
                    Cancel
                </Button>
            </div>
        </div>
    </div> 
  )
};

export default DeletePopup;
