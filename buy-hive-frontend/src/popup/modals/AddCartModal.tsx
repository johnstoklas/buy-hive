import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { useAuth0 } from '@auth0/auth0-react';
import { useCarts } from '../context/CartsProvider';

import { useClickOutside } from '../../hooks/useClickOutside';
import { onEnter } from '../../utils/keyboard';

import FixedContainer from '../ui/containerUI/fixedContainer';
import Container from '../ui/containerUI/container';

interface AddCartModalProps {
    addCartVisible: boolean;
    setAddCartVisibile: Dispatch<SetStateAction<boolean>>;
    addCartButtonRef: React.RefObject<HTMLElement | null>;
    setAddCartAnimating: Dispatch<SetStateAction<boolean>>;
}

const AddCartModal = ({ 
    addCartVisible, 
    setAddCartVisibile, 
    addCartButtonRef,
    setAddCartAnimating
} : AddCartModalProps) => {
    const { carts, setCarts } = useCarts();
    const { isAuthenticated, isLoading } = useAuth0();

    const [cartName, setCartName] = useState("");

    const addCartRef = useRef(null);
    
    // Handles if user clicks outside of the component
    useClickOutside(addCartRef, addCartVisible, setAddCartVisibile, [addCartButtonRef]);

    // On mount set the cart to animating
    useEffect(() => {
        setAddCartAnimating(true);
    }, []);

    // Handles adding a new folder
    const handleAddCart = (cartName: string) => {  
        if(isLoading || !isAuthenticated) return;

        const trimmedCartName = cartName.trim();
        const isDuplicate = carts.some((cart) => cart.cart_name === trimmedCartName);
        if (isDuplicate || !trimmedCartName) {
            // showNotification("Invalid Cart Name", false);
            return;
        }

        const data = { cartName: trimmedCartName };
        chrome.runtime.sendMessage({ action: "addNewCart", data }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error communicating with background script:", chrome.runtime.lastError.message);
                return;
            }
            
            if (response?.status === "success" && response?.data) {
                setCarts((prev) => [...prev, response.data]);
                setCartName("");
            } else {
                console.error(response?.message);
                // showNotification("Error Adding Cart", false);
            }
        });
    };
  
    return (
        <FixedContainer>
            <Container 
                className={`!px-3 w-full !rounded-lg shadow-bottom ${addCartVisible ? "slide-in" : "slide-out"}`}
                ref={addCartRef}
                onAnimationEnd={() => {
                    if (!addCartVisible) setAddCartAnimating(false);
                }}
            > 
                <input 
                    type="text" 
                    className="flex-1 bg-[var(--input-color)] p-1 rounded-md"
                    placeholder="Cart Name" 
                    value={cartName} 
                    onChange={(e) => setCartName(e.target.value)}
                    onKeyDown={(e) => onEnter(e, () => handleAddCart(cartName))}
                />
                <button 
                    type="button" 
                    className="shrink-0 bg-[var(--accent-color)] px-2 py-1 rounded-md hover:cursor-pointer"
                    onClick={() => handleAddCart(cartName)} 
                >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
            </Container>
        </FixedContainer>
    )
};

export default AddCartModal;
