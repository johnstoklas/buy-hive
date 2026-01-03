import { useAuth0 } from '@auth0/auth0-react';
import type { CartType } from '@/types/CartType';
import { useCarts } from '../context/CartsProvider';
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../ui/button';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import type { ItemType } from '@/types/ItemType';
import { useLocked } from '../context/LockedProvider';

interface DeleteModalProps {
    cart: CartType;
    item?: ItemType;
    
    setDropdownVisible: Dispatch<SetStateAction<boolean>>;
    setDropdownHidden: Dispatch<SetStateAction<boolean>>;
    setDeleteModal: Dispatch<SetStateAction<boolean>>;

    deleteModalRef: React.RefObject<HTMLElement | null>;
    type: string;

    updateCarts?;
}

const DeleteModal = ({ 
    cart, 
    item,
    setDropdownVisible, 
    setDropdownHidden, 
    setDeleteModal, 
    deleteModalRef, 
    type,
    updateCarts,
} : DeleteModalProps) => {

    const { cart_id: cartId } = cart;

    const { isAuthenticated } = useAuth0(); 
    const { setCarts } = useCarts();
    const { setIsLocked } = useLocked();

    const handleDeleteCart = () => {
        if (!isAuthenticated) return;

        chrome.runtime.sendMessage({ action: "deleteCart", data: { cartId } }, (response) => {
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
                console.error("Error deleting cart:", response?.message);
            }
        });
    };

    useEffect(() => {
        setDropdownHidden(true);
    }, [setDropdownHidden]);
    
    const closePopup = () => {
        setDropdownVisible(false);
        setDropdownHidden(false);
        setIsLocked(false);
        setDeleteModal(false);
    }

  // Delete an item
  const handleDeleteItem = () => {
    if(!item || !updateCarts) return;
    const data = {cartId: cart.cart_id, itemId: item.item_id};

    chrome.runtime.sendMessage({action: "deleteItem", data: data}, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error communicating with background script:", chrome.runtime.lastError.message);
        return;
      }

      if (response?.status === "success") {
        const newSelectedCarts = item.selected_cart_ids = item.selected_cart_ids.filter(id=> id !== cartId);
        const updatedItem = {
          image: item.image,
          item_id: item.item_id,
          name: item.name,
          notes: item.notes,
          price: item.price,
          selected_cart_ids: newSelectedCarts,
          url: item.url
        }
        updateCarts(updatedItem);
      } else {
        console.error("Error deleting item:", response?.message);
      }
    });
  }

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
  
    const getDeleteMessage = () => {
        switch (type) {
            case "folder":
                return "Are you sure you want to delete this folder?";
            case "item":
                return "Are you sure you want to delete this item?";
            default:
                return "Are you sure you want to delete this item permanently?";
        }
    }

    const handleSubmit = () => {
        switch (type) {
            case "folder":
                handleDeleteCart();
                break;
            case "item":
                handleDeleteItem();   
                break;
            default:
                return;             
        }
        closePopup();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center px-4">
            <div 
                className="flex flex-1 flex-col relative justify-center text-center py-3 gap-2 rounded-lg bg-[var(--secondary-background)] shadow-bottom"
                ref={deleteModalRef}
            > 
                <p className="absolute right-3 top-2 hover:cursor-pointer hover:font-bold" onClick={closePopup}> &#10005; </p>
                <div className="mt-4 mb-2">
                    <FontAwesomeIcon 
                        icon={faTrashCan} 
                        className="text-base"
                    />
                </div>
                <p> {getDeleteMessage(type)} </p>
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

export default DeleteModal;

