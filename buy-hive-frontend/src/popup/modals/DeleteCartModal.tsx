import { useAuth0 } from '@auth0/auth0-react';
import type { CartType } from '@/types/CartType';
import { useCarts } from '../context/CartsProvider';
import ModalOutline from '../ui/modalOutline';
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../ui/button';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

interface DeletePopupProps {
    cart: CartType;
    setCartDropdownVisible: Dispatch<SetStateAction<boolean>>;
    setCartDropdownHidden: Dispatch<SetStateAction<boolean>>;
    setDeleteCartModal: Dispatch<SetStateAction<boolean>>;
    deleteCartModalRef: React.RefObject<HTMLElement | null>;
}

const DeletePopup = ({ cart, setCartDropdownVisible, setCartDropdownHidden, setDeleteCartModal, deleteCartModalRef } : DeletePopupProps) => {

    const { cart_id: cartId } = cart;

    const { isAuthenticated } = useAuth0(); 
    const { setCarts } = useCarts();

    // TODO: REMOVE HARD CODING
    const type = "folder"

    const handleDeleteSection = () => {
        if (!isAuthenticated) return;

        chrome.runtime.sendMessage({ action: "deleteFolder", data: { cartId } }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error communicating with background script:", chrome.runtime.lastError.message);
                return;
            }

            if (response.status === "success") {
                setCarts((prev) => prev.filter((section) => section.cart_id !== cartId));
                // itemsInFolder.forEach((item) => {
                //     const newSelectedCarts = item.selected_cart_ids = item.selected_cart_ids.filter(id=> id !== cartId);
                // });
            } else {
                console.error("Error deleting folder:", response?.message);
            }
        });
    };

    useEffect(() => {
        setCartDropdownHidden(true);
    }, [setCartDropdownHidden]);
    
    const closePopup = () => {
        setCartDropdownVisible(false);
        setCartDropdownHidden(false);
        setIsLocked(false);
        setDeleteCartModal(false);
    }
    
    const handleSubmit = () => {
        handleDeleteSection();
        closePopup();
    }

  // Delete an item
//   const handleDeleteItem = (cartId, itemId) => {

//     const data = {
//       accessToken: userData,
//       cartId: cartId,
//       itemId: itemId,
//     };

//     chrome.runtime.sendMessage({action: "deleteItem", data: data}, (response) => {
//       if (chrome.runtime.lastError) {
//         console.error("Error communicating with background script:", chrome.runtime.lastError.message);
//         return;
//       }

//       if (response?.status === "success") {
//         setItemsInFolder((prev) => prev.filter((section) => section.item_id !== itemId));
//         const newSelectedCarts = item.selected_cart_ids = item.selected_cart_ids.filter(id=> id !== cartId);
//         const sentData = {
//           image: item.image,
//           item_id: item.item_id,
//           name: item.name,
//           notes: item.notes,
//           price: item.price,
//           selected_cart_ids: newSelectedCarts,
//           url: item.url
//         }
//         chrome.runtime.sendMessage({action: "updateItems", data: sentData});
//       } else {
//         console.error("Error deleting item:", response?.message);
//       }
//     });
//   }

  // Deletes item from all carts
//   const handleDeleteItemAll = (itemId) => {
//     const data = {
//       accessToken: userData,
//       itemId: itemId,
//     };

//     chrome.runtime.sendMessage({action: "deleteItemAll", data: data}, (response) => {
//       if (chrome.runtime.lastError) {
//         console.error("Error communicating with background script:", chrome.runtime.lastError.message);
//         return;
//       }

//       if (response?.status === "success") {
//         setItemsInFolder((prev) => prev.filter((section) => section.item_id !== itemId));
//         const sentData = {
//           item_id: itemId,
//           selected_cart_ids: [],
//         }
//         chrome.runtime.sendMessage({action: "updateItems", data: sentData});
//         showNotification("Succesfully deleted item everywhere!", true);
//       } else {
//         showNotification("Error deleting item everywhere", false);
//         console.error("Error deleting item:", response?.message);
//       }
//     });
//   }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4">
        <div 
            className="flex flex-1 flex-col relative justify-center text-center py-3 gap-2 rounded-lg bg-[var(--secondary-background)] shadow-bottom"
            ref={deleteCartModalRef}
        > 
            <p className="absolute right-3 top-2 hover:cursor-pointer hover:font-bold" onClick={closePopup}> &#10005; </p>
            <div className="mt-4 mb-2">
                <FontAwesomeIcon 
                    icon={faTrashCan} 
                    className="text-base"
                />
            </div>
            {type === "folder" ? (
            <p> Are you sure you want to delete this folder? </p>
            ) : type === "item" ? (
            <p> Are you sure you want to delete this item? </p>
            ) : (
            <p>Are you sure you want to delete this item permanently?</p>
            )}
            <div className="flex gap-2 justify-center">
                <Button 
                    onClick={handleSubmit}
                    isDelete={true}
                    isModal={true}
                > 
                    Yes, I'm sure 
                </Button>
                <Button 
                    onClick={closePopup}
                    isModal={true}
                > 
                    No, cancel 
                </Button>
            </div>
        </div>
    </div> 
  )
};

export default DeletePopup;
function setIsLocked(arg0: boolean) {
    throw new Error('Function not implemented.');
}

