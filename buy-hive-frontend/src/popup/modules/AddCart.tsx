import { useRef, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import type { Cart } from '@/types/Carts';

interface AddFileProps {
    carts: Cart[]
    setCarts: Dispatch<SetStateAction<Cart[]>>;
}
const AddFile = ({carts, setCarts} : AddFileProps) => {
    const [cartName, setCartName] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    // const addFile = useRef(null);

    // const {userData} = userDataContext();

    // Handles adding a new folder
    const handleAddCart = (cartName: string) => {  
        // if(!userData) {
        //     // showNotification("Error Adding Folder", false);
        //     return;
        // } 

        const trimmedCartName = cartName.trim();
        const isDuplicate = carts.some((cart) => cart.name === trimmedCartName);
        
        if (isDuplicate || !trimmedCartName) {
            // showNotification("Invalid Folder Name!", false);
            return;
        }

        // const data = { email: userData.email, cartName: trimmedCartName };
        const data = "hello"

        chrome.runtime.sendMessage({ action: "addNewFolder", data }, (response) => {
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
            // id="add-file-section"
            className="flex mb-16 mx-1 py-2 absolute bg-[var(--secondary-background)] text-var(--text-color) justify-center"
            //   className={isVisible ? "slide-in-add-file" : "slide-out-add-file"} 
            //   ref={addFile}
            //   onAnimationEnd={() => {
            //     if (!isVisible) setIsAnimating(false);
            //   }}
        > 
            <input 
                type="text" 
                // id="file-title" 
                className="max-w-5xl mx-auto bg-[#eaeaea] p-1"
                placeholder="Cart Name" 
                value={cartName} 
                onChange={(e) => setCartName(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button 
                type="button" 
                // id="submit-file" 
                className="max-w-xl mx-auto bg-[var(--accent-color)] p-1"
                onClick={() => handleAddCart(cartName)} 
            >
                <FontAwesomeIcon icon={faCheck} />
            </button>
        </div>
    )
};

export default AddFile;
