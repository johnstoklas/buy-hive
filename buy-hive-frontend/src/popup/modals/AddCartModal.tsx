import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { useClickOutside } from '../../hooks/useClickOutside';
import { onEnter } from '../../utils/keyboard';

import FixedContainer from '../ui/containerUI/fixedContainer';
import Container from '../ui/containerUI/container';
import useCartActions from '@/hooks/useCartActions';

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
    const [cartName, setCartName] = useState("");

    const addCartRef = useRef(null);
    
    // Handles if user clicks outside of the component
    useClickOutside(addCartRef, addCartVisible, setAddCartVisibile, [addCartButtonRef]);

    // On mount set the cart to animating
    useEffect(() => {
        setAddCartAnimating(true);
    }, []);

    const { addCart } = useCartActions({setCartName});
  
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
                    onKeyDown={(e) => onEnter(e, () => addCart(cartName))}
                />
                <button 
                    type="button" 
                    className="shrink-0 bg-[var(--accent-color)] px-2 py-1 rounded-md hover:cursor-pointer"
                    onClick={() => addCart(cartName)} 
                >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
            </Container>
        </FixedContainer>
    )
};

export default AddCartModal;
