import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAuth0 } from '@auth0/auth0-react';
import { useClickOutside } from '../hooks/useClickOutside';
import { useCarts } from '../context/CartsProvider';

interface AddCartModalProps {
    addCartVisible: boolean;
    setAddCartVisibile: Dispatch<SetStateAction<boolean>>;
    addCartButtonRef: React.RefObject<HTMLElement | null>;
}

const AddCartModal = ({ 
    addCartVisible, 
    setAddCartVisibile, 
    addCartButtonRef
} : AddCartModalProps) => {
    const { carts, setCarts } = useCarts();
    const { isAuthenticated, isLoading } = useAuth0();

    const [cartName, setCartName] = useState("");
    const addCartRef = useRef(null);

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

    // Handles if user clicks outside of the component
    useClickOutside(addCartRef, addCartVisible, setAddCartVisibile, [addCartButtonRef]);

    // Handles if user presses enter instead of presses submit button
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddCart(cartName);
        }
    };
  
    return (
        <div className="fixed bottom-14 left-0 right-0 px-4 my-3">
        <div 
            className={
                `flex py-2 px-3 gap-2 w-full bg-[var(--secondary-background)] rounded-lg shadow-bottom 
                ${addCartVisible ? "slide-in-add-file" : "slide-out-add-file"}`
            }
            ref={addCartRef}
        > 
            <input 
                type="text" 
                className="flex-1 bg-[var(--input-color)] p-1 rounded-md"
                placeholder="Cart Name" 
                value={cartName} 
                onChange={(e) => setCartName(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button 
                type="button" 
                className="shrink-0 bg-[var(--accent-color)] px-2 py-1 rounded-md hover:cursor-pointer"
                onClick={() => handleAddCart(cartName)} 
            >
                <FontAwesomeIcon icon={faCheck} />
            </button>
        </div>
        </div>
    )
};

export default AddCartModal;
