import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneElement, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from '../context/LockedProvider';
import { useAuth0 } from '@auth0/auth0-react';
import type { CartType } from '@/types/CartType';
import { useCarts } from '../context/CartsProvider';
import Button from '../ui/button';

interface DeletePopupProps {
    cart: CartType,
    setCartDropdownHidden: Dispatch<SetStateAction<boolean>>;
    setDeleteCartModal: Dispatch<SetStateAction<boolean>>;
}

const DeletePopup = ({ cart, setCartDropdownHidden, setDeleteCartModal } : DeletePopupProps) => {

    const { cart_id: cartId } = cart;

    const { setIsLocked } = useLocked();
    const { isAuthenticated } = useAuth0(); 
    const { setCarts } = useCarts();

    // HARD CODED FIX THIS
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

    useEffect(() => {
        setCartDropdownHidden(true);
    }, [setDeleteCartModal]);

    const closePopup = () => {
        // setSec(false);
        setCartDropdownHidden(false);
        setIsLocked(false);
        setDeleteCartModal(false);
    }

    const submitDelete = () => {
        if (type === "folder") handleDeleteSection();
        // else if(type === "item") {
        //   handleDeleteItem(cartId, itemId);  
        // }
        // else if(type === "move") {
        //   handleDeleteItemAll(itemId);
        // }
        closePopup();
    }
  
  return (
    <div className="flex flex-col fixed text-center px-2 py-2 rounded-lg bg-[var(--secondary-background)] shadow-bottom"> 
        <p id="close-delete-popup" onClick={closePopup}> &#10005; </p>
        <FontAwesomeIcon icon={faTrashCan} id="trash-icon" />
        {type === "folder" ? (
          <p> Are you sure you want to delete this folder? </p>
        ) : type === "item" ? (
          <p> Are you sure you want to delete this item? </p>
        ) : (
          <p>Are you sure you want to delete this item permanently?</p>
        )}
        <div id="dps-button-section">
          <Button id="dps-delete-button" onClick={submitDelete}> Yes, I'm sure </Button>
          <Button id="dps-cancel-button" onClick={closePopup}> No, cancel </Button>
        </div>
    </div>
  )
};

export default DeletePopup;
