import { useState, type Dispatch, type SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import type { CartType } from '@/types/CartType';
import { useAuth0 } from '@auth0/auth0-react';

interface AddFileProps {
    carts: CartType[]
    setCarts: Dispatch<SetStateAction<CartType[]>>;
}

const AddCart = ({carts, setCarts} : AddFileProps) => {
    const [cartName, setCartName] = useState("");
    // const [isAnimating, setIsAnimating] = useState(false);

    const { isAuthenticated, isLoading } = useAuth0();
    // const addFile = useRef(null);

    // const {userData} = userDataContext();

    // Handles adding a new folder
    const handleAddCart = (cartName: string) => {  
        if(isLoading || !isAuthenticated) return;

        const trimmedCartName = cartName.trim();
        const isDuplicate = carts.some((cart) => cart.cart_name === trimmedCartName);
        if (isDuplicate || !trimmedCartName) {
            // showNotification("Invalid Folder Name", false);
            return;
        }

        const data = { cartName: trimmedCartName };
        chrome.runtime.sendMessage({ action: "addNewCart", data }, (response) => {
            if (response?.status === "success" && response?.data) {
                setCarts((prev) => [...prev, response.data]);
                setCartName("");
                // showNotification("Succesfully Added Folder!", true);

                // if (organizationSectionRef.current) {
                //     organizationSectionRef.current.scrollTo({
                //         top: organizationSectionRef.current.scrollHeight,
                //         behavior: 'smooth'
                //     });
                // }
            } else {
                console.error(response?.message);
                // showNotification("Error Adding Folder", false);
            }
        });
    };

//   useEffect(() => {
//     if (isVisible) {
//       setIsAnimating(true);
//     }
//   }, [isVisible]);

//   const handleClickOutside = (event) => {
//     if (isVisible && addFile.current && !addFile.current.contains(event.target)) {
//       setIsVisible(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, [isVisible]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleAddCart(cartName)
    }
  };
  
//   return (isVisible || isAnimating) ? (
    return (
        <div 
            className="flex my-2 py-2 px-2 gap-2 fixed bottom-14 w-full bg-[var(--secondary-background)] text-var(--text-color)"
            //   className={isVisible ? "slide-in-add-file" : "slide-out-add-file"} 
            //   ref={addFile}
            //   onAnimationEnd={() => {
            //     if (!isVisible) setIsAnimating(false);
            //   }}
        > 
            <input 
                type="text" 
                className="flex-1 bg-[#eaeaea] p-1"
                placeholder="Cart Name" 
                value={cartName} 
                onChange={(e) => setCartName(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button 
                type="button" 
                className="shrink-0 bg-[var(--accent-color)] p-1 hover:cursor-pointer"
                onClick={() => handleAddCart(cartName)} 
            >
                <FontAwesomeIcon icon={faCheck} />
            </button>
        </div>
    )
};

export default AddCart;
